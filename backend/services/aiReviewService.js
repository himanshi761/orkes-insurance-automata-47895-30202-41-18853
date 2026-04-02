import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
import Tesseract from "tesseract.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const svgToText = (content) =>
  content
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeText = (value = "") =>
  String(value).toLowerCase().replace(/\s+/g, " ").trim();

const formatCurrency = (value) =>
  Number.isFinite(Number(value)) ? `Rs. ${Number(value).toFixed(2)}` : "Rs. 0.00";

const extractNumbers = (text) => {
  const matches = text.match(/\b\d[\d,]*\.?\d{0,2}\b/g) || [];
  return matches
    .map((value) => Number(value.replace(/,/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0);
};

const extractFileName = (fileUrl = "") => path.basename(fileUrl);

async function extractTextFromDocument(document) {
  const filePath = path.resolve(process.cwd(), document.fileUrl);
  const mimeType = document.fileType || "";

  try {
    if (IMAGE_MIME_TYPES.has(mimeType)) {
      const result = await Tesseract.recognize(filePath, "eng");
      return result.data?.text?.trim() || "";
    }

    if (mimeType === "application/pdf" || filePath.toLowerCase().endsWith(".pdf")) {
      const buffer = await fs.readFile(filePath);
      const parsed = await pdfParse(buffer);
      return parsed.text?.trim() || "";
    }

    const raw = await fs.readFile(filePath, "utf8");

    if (mimeType === "image/svg+xml" || filePath.toLowerCase().endsWith(".svg")) {
      return svgToText(raw);
    }

    return raw.trim();
  } catch (error) {
    return "";
  }
}

function buildRecommendation({ amountStatus, identityStatus, hasPrescription, hasBill }) {
  if (amountStatus === "mismatch" || identityStatus === "mismatch") {
    return "reject";
  }

  if (amountStatus === "matched" && identityStatus === "matched" && (hasPrescription || hasBill)) {
    return "approve";
  }

  return "manual_review";
}

function buildConfidence({ amountStatus, identityStatus, documentCount }) {
  let score = 0.32;

  if (amountStatus === "matched") score += 0.24;
  if (identityStatus === "matched") score += 0.22;
  if (documentCount >= 2) score += 0.12;
  if (documentCount >= 3) score += 0.08;

  if (amountStatus === "mismatch") score -= 0.14;
  if (identityStatus === "mismatch") score -= 0.14;

  return Math.max(0.1, Math.min(0.96, Number(score.toFixed(2))));
}

export async function generateClaimReview({ claim, documents = [], customer }) {
  const claimedAmount = Number(claim.amount || 0);
  const customerName = normalizeText(customer?.name);
  const policyNumber = normalizeText(claim.policyNumber);
  const claimType = String(claim.type || "claim").trim();

  const documentAnalyses = await Promise.all(
    documents.map(async (document) => {
      const text = await extractTextFromDocument(document);
      const normalized = normalizeText(text);
      const numericValues = extractNumbers(text);
      const fileName = extractFileName(document.fileUrl);

      const hasBillTerms =
        /(bill|invoice|receipt|amount due|medical bill|total amount|charges)/i.test(text);
      const hasPrescriptionTerms = /(prescription|medicine|dosage|rx|tablet|capsule)/i.test(text);
      const hasIdentityTerms = /(customer id|policy holder|national id|aadhaar|passport|driving licence|name)/i.test(text);

      return {
        fileName,
        fileUrl: document.fileUrl,
        text,
        normalized,
        numericValues,
        hasBillTerms,
        hasPrescriptionTerms,
        hasIdentityTerms,
      };
    })
  );

  const billNumbers = documentAnalyses
    .filter((entry) => entry.hasBillTerms)
    .flatMap((entry) => entry.numericValues)
    .filter((value) => value <= 10000000);

  const detectedBillTotal = billNumbers.length ? Math.max(...billNumbers) : null;
  const amountDifference =
    detectedBillTotal === null ? null : Math.abs(detectedBillTotal - claimedAmount);

  let amountStatus = "unclear";
  let amountMessage = "The uploaded documents did not provide a clear bill total yet.";

  if (detectedBillTotal !== null) {
    if (amountDifference <= Math.max(5, claimedAmount * 0.05)) {
      amountStatus = "matched";
      amountMessage = `Detected bill total ${formatCurrency(detectedBillTotal)} is close to the claimed amount.`;
    } else {
      amountStatus = "mismatch";
      amountMessage = `Detected bill total ${formatCurrency(detectedBillTotal)} does not match the claimed amount ${formatCurrency(claimedAmount)}.`;
    }
  }

  const identityMatches = documentAnalyses.some((entry) => {
    if (!entry.hasIdentityTerms) return false;
    if (customerName && entry.normalized.includes(customerName)) return true;
    if (policyNumber && entry.normalized.includes(policyNumber)) return true;
    return false;
  });

  const hasIdentityEvidence = documentAnalyses.some((entry) => entry.hasIdentityTerms);

  let identityStatus = "unclear";
  let identityMessage = `Identity validation for this customer still needs manual review.`;

  if (hasIdentityEvidence && identityMatches) {
    identityStatus = "matched";
    identityMessage = "Detected identity details are consistent with the customer profile or policy number.";
  } else if (hasIdentityEvidence && !identityMatches) {
    identityStatus = "mismatch";
    identityMessage = "Identity details were found in the documents but do not clearly match the customer profile.";
  }

  const hasPrescription = documentAnalyses.some((entry) => entry.hasPrescriptionTerms);
  const hasBill = documentAnalyses.some((entry) => entry.hasBillTerms);
  const recommendation = buildRecommendation({
    amountStatus,
    identityStatus,
    hasPrescription,
    hasBill,
  });
  const confidence = buildConfidence({
    amountStatus,
    identityStatus,
    documentCount: documentAnalyses.length,
  });

  const redFlags = [];

  if (!documentAnalyses.length) {
    redFlags.push("No supporting documents were uploaded.");
  }
  if (amountStatus === "mismatch") {
    redFlags.push("Claim amount does not align with the detected bill total.");
  }
  if (identityStatus === "mismatch") {
    redFlags.push("Customer identity details do not clearly match the uploaded proof.");
  }
  if (!hasBill) {
    redFlags.push("A bill or invoice was not clearly detected in the uploaded files.");
  }

  const guidance = [];
  if (identityStatus !== "matched") {
    guidance.push("Verify the detected ID details against the customer profile.");
  }
  if (amountStatus === "matched") {
    guidance.push("Detected bill total is close to the customer-entered amount.");
  } else {
    guidance.push("Compare the claimed amount with invoices or bills before approving.");
  }
  if (hasPrescription) {
    guidance.push("Prescription or treatment evidence is present.");
  } else {
    guidance.push("Check whether treatment evidence is sufficient for this claim type.");
  }

  const summaryParts = [
    `${claimType} claim submitted with ${documentAnalyses.length} uploaded document${documentAnalyses.length === 1 ? "" : "s"}.`,
  ];

  if (amountStatus === "matched") {
    summaryParts.push(`Detected bill total aligns with the claimed amount.`);
  } else if (amountStatus === "mismatch") {
    summaryParts.push(`Detected bill total differs from the claimed amount.`);
  }

  if (identityStatus === "matched") {
    summaryParts.push(`Identity evidence matches the customer profile.`);
  } else if (identityStatus === "mismatch") {
    summaryParts.push(`Identity evidence needs closer review.`);
  }

  return {
    recommendation,
    confidence,
    summary: summaryParts.join(" "),
    amountCheck: {
      status: amountStatus,
      detectedTotal: detectedBillTotal,
      claimedAmount,
      message: amountMessage,
    },
    identityCheck: {
      status: identityStatus,
      message: identityMessage,
    },
    aiChecks: documentAnalyses.map((entry) => ({
      label: entry.fileName,
      status:
        entry.text.length > 0
          ? entry.hasIdentityTerms || entry.hasBillTerms || entry.hasPrescriptionTerms
            ? "verified"
            : "received"
          : "received",
      detail:
        entry.text.length > 0
          ? "Text was extracted and reviewed."
          : "Document uploaded and ready for manual review.",
    })),
    redFlags,
    guidance,
    documents: documentAnalyses.map((entry) => ({
      fileName: entry.fileName,
      fileUrl: entry.fileUrl,
      preview: entry.text.slice(0, 240),
    })),
  };
}

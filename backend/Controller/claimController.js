import Claim from "../model/claimModel.js";
import Document from "../model/documentSchema.js";
import User from "../model/userModel.js";
import { generateClaimReview } from "../services/aiReviewService.js";

const populateClaim = (query) =>
  query
    .populate("user", "name email role")
    .populate("agent", "name email role")
    .populate("documents");

const attachReviewToClaim = async (claimId) => {
  const claim = await populateClaim(Claim.findById(claimId));
  if (!claim) return null;

  const documents =
    claim.documents?.length > 0
      ? claim.documents
      : await Document.find({ claim: claim._id });
  const customer =
    claim.user && typeof claim.user === "object"
      ? claim.user
      : await User.findById(claim.user);

  try {
    const review = await generateClaimReview({
      claim,
      documents,
      customer,
    });

    claim.aiResult = review;
    claim.aiReviewStatus = "completed";
    claim.aiReviewedAt = new Date();
    claim.workflow_step = Math.max(claim.workflow_step || 1, 3);
    await claim.save();

    return populateClaim(Claim.findById(claim._id));
  } catch (error) {
    claim.aiReviewStatus = "failed";
    claim.aiReviewedAt = new Date();
    claim.aiResult = {
      recommendation: "manual_review",
      confidence: 0.2,
      summary: "Local OCR review could not be completed for this claim.",
      amountCheck: {
        status: "unclear",
        message: "Amount validation could not be completed.",
      },
      identityCheck: {
        status: "unclear",
        message: "Identity validation could not be completed.",
      },
      aiChecks: documents.map((document) => ({
        label: document.fileUrl?.split("/").pop(),
        status: "received",
        detail: "Document uploaded and ready for manual review.",
      })),
      redFlags: [error.message || "Local OCR review failed."],
      guidance: ["Review the uploaded documents manually before deciding the claim."],
      documents: [],
    };
    await claim.save();
    return populateClaim(Claim.findById(claim._id));
  }
};

export const getClaims = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "customer") {
      filter = { user: req.user.userId };
    } else if (req.user.role === "agent") {
      filter = { agent: req.user.userId };
    }

    const claims = await populateClaim(
      Claim.find(filter).sort({ createdAt: -1 })
    );

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignedClaims = async (req, res) => {
  try {
    const claims = await populateClaim(
      Claim.find({
        agent: req.user.userId,
        status: { $in: ["pending", "assigned", "in-progress"] },
      }).sort({ createdAt: -1 })
    );

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewedClaims = async (req, res) => {
  try {
    const claims = await populateClaim(
      Claim.find({
        agent: req.user.userId,
        status: { $in: ["approved", "rejected", "paid"] },
      }).sort({ reviewedAt: -1, createdAt: -1 })
    );

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClaimDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ claim: req.params.id }).sort({
      createdAt: 1,
    });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

export const createClaim = async (req, res) => {
  try {
    const { type, policyNumber, date, description, amount } = req.body;

    const claim = await Claim.create({
      user: req.user.userId,
      type,
      policyNumber,
      date,
      description,
      amount: Number(amount || 0),
      status: "pending",
      workflow_step: 1,
      aiReviewStatus: "not_requested",
    });

    let createdDocuments = [];

    if (req.files?.length) {
      createdDocuments = await Document.insertMany(
        req.files.map((file) => ({
          claim: claim._id,
          fileUrl: file.path.replace(/\\/g, "/"),
          fileType: file.mimetype,
          uploadedBy: req.user.userId,
        }))
      );

      claim.documents = createdDocuments.map((document) => document._id);
      await claim.save();
    }

    const reviewedClaim = await attachReviewToClaim(claim._id);
    res.status(201).json(reviewedClaim || claim);
  } catch (error) {
    console.error("Error creating claim:", error);
    res.status(500).json({ message: "Error creating claim" });
  }
};

export const rerunAiReview = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    const reviewedClaim = await attachReviewToClaim(req.params.id);
    res.json(reviewedClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignClaim = async (req, res) => {
  try {
    const { agentId } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.agent = agentId;
    claim.status = "assigned";
    claim.assignedAt = new Date();
    claim.workflow_step = Math.max(claim.workflow_step || 1, 3);
    await claim.save();

    const updatedClaim = await populateClaim(Claim.findById(claim._id));
    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClaimStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (String(claim.agent) !== String(req.user.userId)) {
      return res.status(403).json({ message: "This claim is not assigned to you." });
    }

    claim.status = status;
    claim.agentNotes = notes || "";
    claim.reviewedAt = new Date();
    claim.workflow_step = Math.max(claim.workflow_step || 1, 4);
    await claim.save();

    const updatedClaim = await populateClaim(Claim.findById(claim._id));
    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markClaimPaid = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status !== "approved") {
      return res.status(400).json({ message: "Only approved claims can be marked as paid." });
    }

    claim.status = "paid";
    claim.paidAt = new Date();
    claim.workflow_step = 5;
    await claim.save();

    const updatedClaim = await populateClaim(Claim.findById(claim._id));
    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReports = async (_req, res) => {
  try {
    const claims = await Claim.find();
    const reports = {
      total: claims.length,
      approved: claims.filter((claim) => ["approved", "paid"].includes(claim.status)).length,
      rejected: claims.filter((claim) => claim.status === "rejected").length,
      paid: claims.filter((claim) => claim.status === "paid").length,
    };

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

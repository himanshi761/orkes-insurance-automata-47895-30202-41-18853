export const API_BASE_URL = "http://localhost:8000";

export const getRecommendationLabel = (recommendation) => {
  if (recommendation === "approve") return "AI suggests approve";
  if (recommendation === "reject") return "AI suggests reject";
  return "AI suggests manual review";
};

export const getRecommendationClassName = (recommendation) => {
  if (recommendation === "approve") return "bg-emerald-100 text-emerald-700";
  if (recommendation === "reject") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
};

export const getAiStatusLabel = (status) => {
  if (status === "completed") return "completed";
  if (status === "failed") return "failed";
  return "not_requested";
};

export const getDocumentUrl = (fileUrl = "") => {
  if (!fileUrl) return "#";
  const cleaned = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
  return `${API_BASE_URL}${cleaned}`;
};

export const getAmountCheckCopy = (result) => {
  if (!result?.amountCheck) {
    return { title: "Amount Check: unclear", body: "Amount validation has not run yet." };
  }

  return {
    title: `Amount Check: ${result.amountCheck.status || "unclear"}`,
    body: result.amountCheck.message || "Amount validation is pending.",
  };
};

export const getIdentityCheckCopy = (result) => {
  if (!result?.identityCheck) {
    return { title: "Identity Check: unclear", body: "Identity validation has not run yet." };
  }

  return {
    title: `Identity Check: ${result.identityCheck.status || "unclear"}`,
    body: result.identityCheck.message || "Identity validation is pending.",
  };
};

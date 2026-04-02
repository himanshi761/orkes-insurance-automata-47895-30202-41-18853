import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WorkflowProgress from "@/components/WorkflowProgress";
import {
  ArrowRight,
  Eye,
  FileText,
  Plus,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import {
  API_BASE_URL,
  getAiStatusLabel,
  getAmountCheckCopy,
  getDocumentUrl,
  getIdentityCheckCopy,
  getRecommendationClassName,
  getRecommendationLabel,
} from "@/lib/aiScreening";

const StatCard = ({ icon: Icon, label, value, tone = "default" }) => {
  const toneClass =
    tone === "gold"
      ? "border-amber-200 bg-amber-50"
      : tone === "green"
        ? "border-emerald-200 bg-emerald-50"
        : tone === "blue"
          ? "border-sky-200 bg-sky-50"
          : "border-slate-200 bg-white";

  return (
    <Card className={`rounded-[1.75rem] border p-5 shadow-sm ${toneClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-950 p-3 text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};

const CustomerDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const location = useLocation();
  const customerName = localStorage.getItem("userName") || "Customer";

  const fetchClaims = async () => {
    try {
      setLoadingClaims(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/claims`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch claims");
      setClaims(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching claims:", error.message);
    } finally {
      setLoadingClaims(false);
    }
  };

  const handleViewDetails = async (claim) => {
    setSelectedClaim(claim);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/claims/${claim._id}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [location.state]);

  const stats = {
    total: claims.length,
    inProgress: claims.filter((claim) =>
      ["pending", "assigned", "in-progress"].includes(claim.status)
    ).length,
    approved: claims.filter((claim) => ["approved", "paid"].includes(claim.status)).length,
    totalAmount: claims.reduce((sum, claim) => sum + (Number(claim.amount) || 0), 0),
  };

  const amountCopy = getAmountCheckCopy(selectedClaim?.aiResult);
  const identityCopy = getIdentityCheckCopy(selectedClaim?.aiResult);

  if (loadingClaims) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
              <div className="bg-[radial-gradient(circle_at_top_left,#fde8a3,transparent_32%),linear-gradient(135deg,#fffdf7_0%,#f5f8fc_100%)] px-8 py-10">
                <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Customer Dashboard</p>
                    <h1 className="mt-3 text-4xl font-bold text-slate-950">
                      Welcome back, {customerName}
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-slate-600">
                      Track your claims, review AI-assisted verification updates, and keep every document in one place.
                    </p>
                  </div>

                  <Link to="/file-claim">
                    <Button className="rounded-2xl bg-slate-950 px-6 py-6 text-base text-white hover:bg-slate-800">
                      <Plus className="mr-2 h-5 w-5" />
                      File a New Claim
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard icon={Receipt} label="Total Claims" value={stats.total} tone="default" />
                  <StatCard icon={Sparkles} label="In Progress" value={stats.inProgress} tone="blue" />
                  <StatCard icon={ShieldCheck} label="Approved / Paid" value={stats.approved} tone="green" />
                  <StatCard
                    icon={Wallet}
                    label="Total Claimed Amount"
                    value={`Rs. ${stats.totalAmount.toLocaleString()}`}
                    tone="gold"
                  />
                </div>
              </div>

              <div className="px-8 py-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-950">Recent Claims</h2>
                    <p className="mt-1 text-slate-500">
                      Open any claim to review AI checks, notes, and uploaded documents.
                    </p>
                  </div>
                </div>

                {claims.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center">
                    <Receipt className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="mt-4 text-xl font-semibold text-slate-900">No claims filed yet</p>
                    <p className="mt-2 text-slate-500">
                      Start your first claim and track every update from this dashboard.
                    </p>
                    <Link to="/file-claim">
                      <Button className="mt-6 rounded-2xl bg-slate-950 px-6 py-6 text-white hover:bg-slate-800">
                        <Plus className="mr-2 h-4 w-4" />
                        File Claim
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {claims.map((claim) => (
                      <Card
                        key={claim._id}
                        className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="max-w-3xl">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-2xl font-bold text-slate-950">
                                {claim.type} Insurance
                              </h3>
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getRecommendationClassName(
                                  claim.aiResult?.recommendation
                                )}`}
                              >
                                {getRecommendationLabel(claim.aiResult?.recommendation)}
                              </span>
                            </div>

                            <p className="mt-3 text-sm capitalize text-slate-500">
                              Status: {claim.status}
                            </p>
                            <p className="mt-4 leading-7 text-slate-700">{claim.description}</p>
                          </div>

                          <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                              Claim Amount
                            </p>
                            <p className="mt-2 text-2xl font-bold">Rs. {claim.amount}</p>
                            <p className="mt-2 text-sm text-slate-300">
                              {new Date(claim.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="text-sm text-slate-500">
                            AI status: {getAiStatusLabel(claim.aiReviewStatus)}
                          </div>
                          <Button
                            variant="outline"
                            className="rounded-2xl px-5"
                            onClick={() => handleViewDetails(claim)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-4">
                          <WorkflowProgress currentStep={claim.workflow_step || 1} />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl lg:p-8">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-950">Claim Details</h2>
                    <p className="mt-1 text-slate-500">
                      {selectedClaim.type} • {selectedClaim.status}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getRecommendationClassName(
                      selectedClaim.aiResult?.recommendation
                    )}`}
                  >
                    {getRecommendationLabel(selectedClaim.aiResult?.recommendation)}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <p><b>Type:</b> {selectedClaim.type}</p>
                    <p><b>Status:</b> {selectedClaim.status}</p>
                    <p><b>Date:</b> {selectedClaim.date}</p>
                    <p><b>Amount:</b> Rs. {selectedClaim.amount}</p>
                    <p className="mt-3 leading-7">{selectedClaim.description}</p>

                    {selectedClaim.agentNotes && (
                      <div className="mt-4 rounded-2xl bg-white p-4">
                        <p className="text-sm font-semibold text-slate-500">Agent Notes</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {selectedClaim.agentNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Confidence: {Math.round((selectedClaim.aiResult?.confidence || 0.32) * 100)}%
                      </span>
                      <span className="text-sm text-slate-500">
                        AI status: {getAiStatusLabel(selectedClaim.aiReviewStatus)}
                      </span>
                    </div>
                    <p className="leading-7 text-slate-700">
                      {selectedClaim.aiResult?.summary || "AI review is not available yet."}
                    </p>
                    <p className="mt-4 text-sm font-medium text-orange-600">{amountCopy.title}</p>
                    <p className="text-sm text-slate-600">{amountCopy.body}</p>
                    <p className="mt-3 text-sm font-medium text-sky-700">{identityCopy.title}</p>
                    <p className="text-sm text-slate-600">{identityCopy.body}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 xl:col-span-2">
                    <h3 className="mb-3 text-lg font-semibold text-slate-950">Documents</h3>
                    {documents.length === 0 ? (
                      <p className="text-sm text-slate-500">No documents uploaded</p>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2">
                        {documents.map((doc) => (
                          <a
                            key={doc._id}
                            href={getDocumentUrl(doc.fileUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-blue-700 hover:bg-blue-50"
                          >
                            <FileText className="h-4 w-4" />
                            View File
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-2xl bg-slate-950 py-3 text-white hover:bg-slate-800"
                  onClick={() => {
                    setSelectedClaim(null);
                    setDocuments([]);
                  }}
                >
                  Close
                </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

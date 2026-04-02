import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import WorkflowProgress from "@/components/WorkflowProgress";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  CircleDollarSign,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  User,
  XCircle,
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

const filters = [
  { label: "All", value: "all" },
  { label: "Assigned / New", value: "assigned" },
  { label: "In Review", value: "in-progress" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const sideNav = [
  { label: "Claims Queue", icon: LayoutDashboard, value: "all" },
  { label: "Assigned to Me", icon: UserCheck, value: "assigned" },
  { label: "AI Signals", icon: Brain, value: "in-progress" },
  { label: "Approved", icon: CircleDollarSign, value: "approved" },
];

const filterClaims = (claims, filter) => {
  if (filter === "all") return claims;
  if (filter === "assigned") {
    return claims.filter((claim) => ["pending", "assigned"].includes(claim.status));
  }
  if (filter === "approved") {
    return claims.filter((claim) => ["approved", "paid"].includes(claim.status));
  }
  return claims.filter((claim) => claim.status === filter);
};

const formatAmount = (amount) => `Rs. ${Number(amount || 0).toLocaleString()}`;

const getStatusTone = (status) => {
  if (status === "approved" || status === "paid") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "rejected") {
    return "bg-red-100 text-red-700";
  }
  if (status === "in-progress") {
    return "bg-sky-100 text-sky-700";
  }
  return "bg-amber-100 text-amber-700";
};

const InfoPanel = ({ title, icon: Icon, children, tone = "default" }) => {
  const toneClass =
    tone === "alert"
      ? "border-red-100 bg-red-50/70"
      : tone === "success"
        ? "border-emerald-100 bg-emerald-50/70"
        : "border-slate-200 bg-white";

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${toneClass}`}>
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-2 text-white">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const AgentDashboard = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [actionNotes, setActionNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const token = localStorage.getItem("token");
  const agentName = localStorage.getItem("userName") || "Agent";
  const agentEmail = localStorage.getItem("userEmail") || "agent@iclaim.local";

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const fetchClaims = async () => {
    const res = await fetch(`${API_BASE_URL}/api/claims`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setClaims(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (!loading && userRole !== "agent") {
      navigate("/auth");
    }
  }, [userRole, loading, navigate]);

  useEffect(() => {
    if (userRole === "agent") {
      fetchClaims();
    }
  }, [userRole]);

  const updateStatus = async (status) => {
    if (!selectedClaim) return;

    try {
      setBusy(true);
      const res = await fetch(
        `${API_BASE_URL}/api/claims/${selectedClaim._id}/status`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            status,
            notes: actionNotes,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update claim");

      setSelectedClaim(null);
      setActionNotes("");
      await fetchClaims();
    } catch (error) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  };

  const rerunAi = async () => {
    if (!selectedClaim) return;

    try {
      setBusy(true);
      const res = await fetch(
        `${API_BASE_URL}/api/claims/${selectedClaim._id}/ai-review`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to rerun AI review");

      setSelectedClaim(data);
      await fetchClaims();
    } catch (error) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const filteredClaims = filterClaims(claims, filter);
  const amountCopy = getAmountCheckCopy(selectedClaim?.aiResult);
  const identityCopy = getIdentityCheckCopy(selectedClaim?.aiResult);

  const stats = {
    total: claims.length,
    assigned: claims.filter((claim) => ["pending", "assigned"].includes(claim.status)).length,
    review: claims.filter((claim) => claim.status === "in-progress").length,
    approved: claims.filter((claim) => ["approved", "paid"].includes(claim.status)).length,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f3e6_0%,#f3f5f8_24%,#eef1f4_100%)] text-slate-900">
      <div className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#9b7305] bg-[linear-gradient(180deg,#c88f00_0%,#a37508_100%)] px-4 py-4 text-white lg:flex lg:flex-col">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-100">iClaim</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight">Agent Panel</h1>
          <p className="mt-2 text-sm leading-6 text-yellow-50/90">
            Review claims faster with document signals, identity checks, and clear next actions.
          </p>
        </div>

        <div className="mt-5 space-y-2">
          {sideNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition ${
                  filter === item.value
                    ? "bg-[#805c05] shadow-lg"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto rounded-3xl border border-white/20 bg-slate-950/20 p-3.5">
          <p className="text-xs uppercase tracking-[0.24em] text-yellow-100">Assigned now</p>
          <p className="mt-1.5 text-3xl font-bold">{stats.assigned}</p>
          <p className="mt-1.5 text-xs leading-5 text-yellow-50/80">
            Claims that still need your action before approval or rejection.
          </p>
        </div>
      </div>

      <div className="lg:pl-64">
        <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#f1b903] p-2 text-slate-950 shadow-sm">
                <Menu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">iClaim</p>
                <p className="text-lg font-semibold">Agent Workspace</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                title="Profile"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/help")}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-6 py-4 lg:px-10">
            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Claims Queue</p>
                <h2 className="mt-1 text-2xl font-bold">Welcome back, {agentName}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Prioritize the most trustworthy claims and review edge cases with confidence.
                </p>
                <p className="mt-1 text-sm text-slate-400">{agentEmail}</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-600">
                <Sparkles className="h-4 w-4 text-amber-500" />
                OCR-powered claim review is active on this workspace
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-950 px-4 py-2.5 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Total Claims</p>
                <p className="mt-1 text-xl font-bold">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5">
                <p className="text-xs uppercase tracking-[0.18em] text-amber-700">Assigned / New</p>
                <p className="mt-1 text-xl font-bold text-amber-900">{stats.assigned}</p>
              </div>
              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2.5">
                <p className="text-xs uppercase tracking-[0.18em] text-sky-700">In Review</p>
                <p className="mt-1 text-xl font-bold text-sky-900">{stats.review}</p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">Approved / Paid</p>
                <p className="mt-1 text-xl font-bold text-emerald-900">{stats.approved}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-5 lg:px-10">
          <div className="mb-5 flex flex-wrap gap-3">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  filter === item.value
                    ? "bg-[#f1b903] text-slate-950 shadow-md"
                    : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {filteredClaims.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 px-8 py-20 text-center shadow-sm">
              <ShieldCheck className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-2xl font-semibold">No claims in this filter</h3>
              <p className="mt-2 text-slate-500">
                Switch filters to review other claims in your queue.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {filteredClaims.map((claim) => (
                <button
                  key={claim._id}
                  type="button"
                  onClick={() => {
                    setSelectedClaim(claim);
                    setActionNotes(claim.agentNotes || "");
                  }}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,#fff3c2,transparent_48%),linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] px-6 py-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-bold">{claim.type}</h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusTone(
                              claim.status
                            )}`}
                          >
                            {claim.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-500">Policy: {claim.policyNumber}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Customer: {claim.user?.name || "Customer"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-md">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Claim Amount</p>
                        <p className="mt-2 text-2xl font-bold">{formatAmount(claim.amount)}</p>
                      </div>
                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-700">
                      {claim.description}
                    </p>
                  </div>

                  <div className="space-y-5 px-6 py-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${getRecommendationClassName(
                          claim.aiResult?.recommendation
                        )}`}
                      >
                        {getRecommendationLabel(claim.aiResult?.recommendation)}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Brain className="h-4 w-4" />
                        AI status: {getAiStatusLabel(claim.aiReviewStatus)}
                      </div>
                    </div>

                    <WorkflowProgress currentStep={claim.workflow_step || 1} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 lg:p-8">
          <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-[#f8fafc] shadow-2xl">
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold">Review Claim</h2>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getRecommendationClassName(
                      selectedClaim.aiResult?.recommendation
                    )}`}
                  >
                    {getRecommendationLabel(selectedClaim.aiResult?.recommendation)}
                  </span>
                </div>
                <p className="mt-2 text-slate-500">
                  {selectedClaim.user?.name || "Customer"} • {selectedClaim.policyNumber}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={rerunAi}
                  disabled={busy}
                >
                  <RotateCcw className="h-4 w-4" />
                  Rerun AI
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setSelectedClaim(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-6 lg:px-8">
              <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
                <div className="space-y-5">
                  <InfoPanel title="Claim Snapshot" icon={FileText}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Type</p>
                        <p className="mt-2 text-lg font-semibold">{selectedClaim.type}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Amount</p>
                        <p className="mt-2 text-lg font-semibold">{formatAmount(selectedClaim.amount)}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
                        <p className="mt-2 text-lg font-semibold capitalize">{selectedClaim.status}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Incident Date</p>
                        <p className="mt-2 text-lg font-semibold">{selectedClaim.date}</p>
                      </div>
                    </div>
                    <p className="mt-4 leading-7 text-slate-700">{selectedClaim.description}</p>
                    <div className="mt-4">
                      <WorkflowProgress currentStep={selectedClaim.workflow_step || 1} />
                    </div>
                  </InfoPanel>

                  <InfoPanel title="AI Review Summary" icon={Sparkles}>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock3 className="h-4 w-4" />
                        AI status: {getAiStatusLabel(selectedClaim.aiReviewStatus)}
                      </div>
                      <div className="text-sm font-medium text-slate-600">
                        Confidence: {Math.round((selectedClaim.aiResult?.confidence || 0.32) * 100)}%
                      </div>
                    </div>
                    <p className="leading-7 text-slate-700">
                      {selectedClaim.aiResult?.summary || "AI review pending."}
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-amber-50 p-4">
                        <p className="text-sm font-semibold text-amber-700">{amountCopy.title}</p>
                        <p className="mt-2 text-sm leading-6 text-amber-900">{amountCopy.body}</p>
                      </div>
                      <div className="rounded-2xl bg-sky-50 p-4">
                        <p className="text-sm font-semibold text-sky-700">{identityCopy.title}</p>
                        <p className="mt-2 text-sm leading-6 text-sky-900">{identityCopy.body}</p>
                      </div>
                    </div>
                  </InfoPanel>

                  <InfoPanel title="Documents" icon={FileText}>
                    <div className="grid gap-3 md:grid-cols-2">
                      {(selectedClaim.documents || []).map((doc) => (
                        <a
                          key={doc._id}
                          href={getDocumentUrl(doc.fileUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
                        >
                          {doc.fileUrl}
                        </a>
                      ))}
                    </div>
                  </InfoPanel>

                  <InfoPanel title="Agent Notes" icon={UserCheck}>
                    <textarea
                      className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-amber-300"
                      placeholder="Add notes for the claim decision..."
                      value={actionNotes}
                      onChange={(event) => setActionNotes(event.target.value)}
                    />

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                        onClick={() => updateStatus("rejected")}
                        disabled={busy}
                      >
                        <XCircle className="h-5 w-5" />
                        Reject
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#f1b903] px-5 py-3 font-medium text-slate-950 shadow hover:bg-[#e1ad03] disabled:opacity-60"
                        onClick={() => updateStatus("approved")}
                        disabled={busy}
                      >
                        <CheckCircle className="h-5 w-5" />
                        Approve
                      </button>
                    </div>
                  </InfoPanel>
                </div>

                <div className="space-y-5">
                  <InfoPanel title="AI Checks" icon={Brain} tone="success">
                    <div className="space-y-3">
                      {(selectedClaim.aiResult?.aiChecks || []).map((check, index) => (
                        <div key={`${check.label}-${index}`} className="rounded-2xl border border-emerald-100 bg-white p-4">
                          <p className="font-medium text-slate-900">{check.label}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {check.status} • {check.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </InfoPanel>

                  <InfoPanel title="Red Flags" icon={AlertTriangle} tone="alert">
                    {selectedClaim.aiResult?.redFlags?.length ? (
                      <ul className="space-y-3">
                        {selectedClaim.aiResult.redFlags.map((flag, index) => (
                          <li key={`${flag}-${index}`} className="rounded-2xl bg-white p-4 text-sm leading-6 text-red-700">
                            {flag}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="rounded-2xl bg-white p-4 text-sm text-slate-500">
                        No AI red flags.
                      </div>
                    )}
                  </InfoPanel>

                  <InfoPanel title="Agent Guidance" icon={ShieldCheck}>
                    <div className="space-y-3">
                      {(selectedClaim.aiResult?.guidance || []).map((item, index) => (
                        <div key={`${item}-${index}`} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </InfoPanel>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;

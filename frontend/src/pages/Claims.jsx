import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClaimStatusBadge from "@/components/ClaimStatusBadge";
import {
  API_BASE_URL,
  getAiStatusLabel,
  getRecommendationClassName,
  getRecommendationLabel,
} from "@/lib/aiScreening";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [agents, setAgents] = useState([]);
  const [updatingClaimId, setUpdatingClaimId] = useState("");
  const token = localStorage.getItem("token");

  const headers = useMemo(
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

  const fetchAgents = async () => {
    const res = await fetch(`${API_BASE_URL}/api/users/agents`);
    const data = await res.json();
    setAgents(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchClaims();
    fetchAgents();
  }, []);

  const assignAgent = async (claimId, agentId) => {
    try {
      setUpdatingClaimId(claimId);
      const res = await fetch(`${API_BASE_URL}/api/claims/${claimId}/assign`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ agentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign agent");
      await fetchClaims();
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingClaimId("");
    }
  };

  const markPaid = async (claimId) => {
    try {
      setUpdatingClaimId(claimId);
      const res = await fetch(`${API_BASE_URL}/api/claims/${claimId}/pay`, {
        method: "PUT",
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to mark payment");
      await fetchClaims();
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingClaimId("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">All Claims</h1>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>AI Review</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {claims.length > 0 ? (
              claims.map((claim) => (
                <TableRow key={claim._id}>
                  <TableCell>{claim.policyNumber || "-"}</TableCell>
                  <TableCell>
                    {claim.user?.name || claim.user?.email || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <ClaimStatusBadge status={claim.status} />
                  </TableCell>
                  <TableCell>Rs. {Number(claim.amount || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {claim.aiResult?.recommendation ? (
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getRecommendationClassName(
                            claim.aiResult.recommendation
                          )}`}
                        >
                          {getRecommendationLabel(claim.aiResult.recommendation)}
                        </span>
                      ) : (
                        <span>AI review pending</span>
                      )}
                      <div className="text-sm text-slate-500">
                        {getAiStatusLabel(claim.aiReviewStatus)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <select
                      value={claim.agent?._id || ""}
                      className="w-48 rounded border px-3 py-2"
                      onChange={(event) => assignAgent(claim._id, event.target.value)}
                    >
                      <option value="">Select agent</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    {claim.status === "paid" ? (
                      <span className="font-medium text-emerald-700">Payment done</span>
                    ) : claim.status === "approved" ? (
                      <button
                        type="button"
                        className="rounded bg-emerald-500 px-4 py-2 text-white disabled:opacity-60"
                        disabled={updatingClaimId === claim._id}
                        onClick={() => markPaid(claim._id)}
                      >
                        {updatingClaimId === claim._id ? "Updating..." : "Mark Paid"}
                      </button>
                    ) : (
                      <span className="text-slate-500">Not ready</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No Claims Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Claims;

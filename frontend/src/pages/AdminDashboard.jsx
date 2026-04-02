import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertTriangle,
  FileText,
  ShieldCheck,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClaimStatusBadge from "@/components/ClaimStatusBadge";
import { API_BASE_URL } from "@/lib/aiScreening";

const SummaryCard = ({ icon: Icon, label, value, tone = "default" }) => {
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
          <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-950 p-3 text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};

const AdminDashboard = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();
  const adminName = localStorage.getItem("userName") || "Admin";

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClaims: 0,
    agents: 0,
    customers: 0,
    paid: 0,
    alerts: 0,
  });

  const [claims, setClaims] = useState([]);

  useEffect(() => {
    if (!loading) {
      if (!userRole) return;
      if (userRole !== "admin") {
        navigate("/auth");
      }
    }
  }, [userRole, loading, navigate]);

  useEffect(() => {
    if (userRole === "admin") {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const usersRes = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = await usersRes.json();

      const claimsRes = await fetch(`${API_BASE_URL}/api/claims`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const claimsData = await claimsRes.json();

      const safeClaims = Array.isArray(claimsData) ? claimsData : [];
      setClaims(safeClaims);

      setStats({
        totalUsers: users.length || 0,
        totalClaims: safeClaims.length || 0,
        agents: users.filter((u) => u.role === "agent").length,
        customers: users.filter((u) => u.role === "customer").length,
        paid: safeClaims.filter((claim) => claim.status === "paid").length,
        alerts: safeClaims.filter((claim) => claim.aiResult?.redFlags?.length > 0).length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#eef1f6_100%)]">
      <main className="p-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="bg-[radial-gradient(circle_at_top_left,#fde8a3,transparent_28%),linear-gradient(135deg,#fffdf7_0%,#f4f7fb_100%)] px-8 py-10">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Admin Control Center</p>
                <h1 className="mt-3 text-4xl font-bold text-slate-950">
                  Welcome back, {adminName}
                </h1>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  Monitor claims, keep agent assignments healthy, and track payment completion across the system.
                </p>
              </div>

              <div className="rounded-[1.75rem] bg-slate-950 px-6 py-5 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Live Portfolio</p>
                <p className="mt-2 text-3xl font-bold">{stats.totalClaims}</p>
                <p className="mt-1 text-sm text-slate-300">total claims under administration</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <SummaryCard icon={FileText} label="Total Claims" value={stats.totalClaims} />
              <SummaryCard icon={UserCheck} label="Agents" value={stats.agents} tone="blue" />
              <SummaryCard icon={Users} label="Customers" value={stats.customers} tone="green" />
              <SummaryCard icon={Wallet} label="Payments Completed" value={stats.paid} tone="gold" />
              <SummaryCard icon={AlertTriangle} label="Claims With Alerts" value={stats.alerts} />
              <SummaryCard icon={ShieldCheck} label="Total Users" value={stats.totalUsers} tone="blue" />
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="mb-6 flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-slate-950">Operational Snapshot</h2>
              <p className="text-slate-500">
                Quick view of the latest claims entering, progressing through, and completing the workflow.
              </p>
            </div>

            <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Policy</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Assigned Agent</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {claims.slice(0, 8).map((claim) => (
                    <TableRow key={claim._id}>
                      <TableCell className="font-medium">{claim.policyNumber || "-"}</TableCell>
                      <TableCell>{claim.user?.name || claim.user?.email || "No User"}</TableCell>
                      <TableCell>
                        <ClaimStatusBadge status={claim.status} />
                      </TableCell>
                      <TableCell>Rs. {Number(claim.amount || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        {claim.date ? new Date(claim.date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>{claim.agent?.name || "Unassigned"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

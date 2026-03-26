import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  FileText,
  AlertTriangle,
  Clock,
  UserCheck,
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

const AdminDashboard = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClaims: 0,
    agents: 0,
    customers: 0,
  });

  const [claims, setClaims] = useState([]);

  // 🔒 Protect route
  useEffect(() => {
    if (!loading) {
      if (!userRole) return;

      if (userRole !== "admin") {
        navigate("/auth");
      }
    }
  }, [userRole, loading, navigate]);

  // 🔥 Fetch data from MongoDB backend
  useEffect(() => {
    if (userRole === "admin") {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Fetch users
      const usersRes = await fetch("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = await usersRes.json();

      // ✅ Fetch claims
      const claimsRes = await fetch("http://localhost:8000/api/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const claimsData = await claimsRes.json();

      setClaims(claimsData || []);

      setStats({
        totalUsers: users.length || 0,
        totalClaims: claimsData.length || 0,
        agents: users.filter((u) => u.role === "agent").length,
        customers: users.filter((u) => u.role === "customer").length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold mb-6">
            Admin Dashboard
          </h1>

          {/* 🔥 STATS */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-4">
              <FileText />
              <p>Total Claims</p>
              <h2>{stats.totalClaims}</h2>
            </Card>

            <Card className="p-4">
              <UserCheck />
              <p>Agents</p>
              <h2>{stats.agents}</h2>
            </Card>

            <Card className="p-4">
              <Users />
              <p>Customers</p>
              <h2>{stats.customers}</h2>
            </Card>

            <Card className="p-4">
              <AlertTriangle />
              <p>Alerts</p>
              <h2>1</h2>
            </Card>
          </div>

          {/* 🔥 CLAIMS TABLE */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {claims.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.policyNumber}</TableCell>
                    <TableCell>{c.user?.name}</TableCell>
                    <TableCell>
                      <ClaimStatusBadge status={c.status} />
                    </TableCell>
                    <TableCell>₹{c.amount}</TableCell>
                    <TableCell>
                      {new Date(c.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
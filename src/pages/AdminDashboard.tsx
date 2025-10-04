import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  FileText,
  TrendingUp,
  Activity,
  AlertTriangle,
  Clock,
  UserCheck,
  Shield,
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

// Mock data for agents
const mockAgents = [
  {
    id: 1,
    name: "Sarah Johnson",
    claimsHandled: 145,
    avgResolutionTime: "2.1 days",
    approvalRate: "94%",
    pendingTasks: 8,
  },
  {
    id: 2,
    name: "Michael Chen",
    claimsHandled: 132,
    avgResolutionTime: "2.4 days",
    approvalRate: "91%",
    pendingTasks: 12,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    claimsHandled: 158,
    avgResolutionTime: "1.9 days",
    approvalRate: "96%",
    pendingTasks: 5,
  },
];

// Mock data for clients
const mockClients = [
  {
    id: 1,
    name: "John Doe",
    agent: "Sarah Johnson",
    policyNo: "POL-2024-001",
    claimCount: 3,
    riskLevel: "Low",
  },
  {
    id: 2,
    name: "Jane Smith",
    agent: "Michael Chen",
    policyNo: "POL-2024-002",
    claimCount: 1,
    riskLevel: "Low",
  },
  {
    id: 3,
    name: "Mike Johnson",
    agent: "Emily Rodriguez",
    policyNo: "POL-2024-003",
    claimCount: 5,
    riskLevel: "High",
  },
];

// Mock data for claims
const mockClaims = [
  {
    id: "CLM123456",
    client: "John Doe",
    agent: "Sarah Johnson",
    status: "in-progress" as const,
    fraudScore: 12,
    date: "2025-09-28",
  },
  {
    id: "CLM123457",
    client: "Jane Smith",
    agent: "Michael Chen",
    status: "pending" as const,
    fraudScore: 8,
    date: "2025-09-27",
  },
  {
    id: "CLM123458",
    client: "Mike Johnson",
    agent: "Emily Rodriguez",
    status: "approved" as const,
    fraudScore: 65,
    date: "2025-09-26",
  },
];

const AdminDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClaims: 0,
    agents: 0,
    customers: 0,
  });

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      navigate("/auth");
    }
  }, [user, userRole, loading, navigate]);

  useEffect(() => {
    if (user && userRole === "admin") {
      fetchStats();
    }
  }, [user, userRole]);

  const fetchStats = async () => {
    try {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role");

      if (roles) {
        setStats({
          totalUsers: roles.length,
          totalClaims: mockClaims.length,
          agents: roles.filter(r => r.role === "agent").length,
          customers: roles.filter(r => r.role === "customer").length,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-gold bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Executive overview of the insurance claim system
            </p>
          </div>

          {/* Top Summary Cards */}
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:shadow-gold">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                  <FileText className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                  <p className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                    {stats.totalClaims}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:shadow-gold">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                  <UserCheck className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <p className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                    {stats.agents}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:shadow-gold">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                    {stats.customers}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:shadow-gold">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                  <Clock className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Process Time</p>
                  <p className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                    2.1d
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-destructive/20 hover:border-destructive/40 transition-all hover:shadow-medium">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fraud Alerts</p>
                  <p className="text-2xl font-bold text-destructive">1</p>
                </div>
              </div>
            </Card>
          </div>

          {/* All Agents Table */}
          <Card className="mb-8 border-primary/20">
            <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/30">
              <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Agent Performance
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Claims Handled</TableHead>
                  <TableHead>Avg Resolution Time</TableHead>
                  <TableHead>Approval Rate</TableHead>
                  <TableHead>Pending Tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAgents.map((agent) => (
                  <TableRow key={agent.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.claimsHandled}</TableCell>
                    <TableCell>{agent.avgResolutionTime}</TableCell>
                    <TableCell>
                      <span className="text-success font-semibold">{agent.approvalRate}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-warning font-semibold">{agent.pendingTasks}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* All Clients Table */}
          <Card className="mb-8 border-primary/20">
            <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/30">
              <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Client Overview
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Policy No.</TableHead>
                  <TableHead>Claim Count</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClients.map((client) => (
                  <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.agent}</TableCell>
                    <TableCell>{client.policyNo}</TableCell>
                    <TableCell>{client.claimCount}</TableCell>
                    <TableCell>
                      <span
                        className={
                          client.riskLevel === "High"
                            ? "text-destructive font-semibold"
                            : "text-success font-semibold"
                        }
                      >
                        {client.riskLevel}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Global Claims Overview */}
          <Card className="border-primary/20">
            <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/30">
              <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Claims Overview
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fraud Score</TableHead>
                  <TableHead>Submission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClaims.map((claim) => (
                  <TableRow key={claim.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.client}</TableCell>
                    <TableCell>{claim.agent}</TableCell>
                    <TableCell>
                      <ClaimStatusBadge status={claim.status} />
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          claim.fraudScore > 50
                            ? "text-destructive font-semibold"
                            : "text-success font-semibold"
                        }
                      >
                        {claim.fraudScore}%
                      </span>
                    </TableCell>
                    <TableCell>{claim.date}</TableCell>
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClaimStatusBadge from "@/components/ClaimStatusBadge";
import WorkflowProgress from "@/components/WorkflowProgress";
import { Search, CheckCircle, XCircle, AlertCircle, FileText, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const AgentDashboard = () => {
  const { toast } = useToast();
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  const [claims, setClaims] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({}); // user_id -> name
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  useEffect(() => {
    if (!loading && (!user || userRole !== "agent")) {
      navigate("/auth");
    }
  }, [user, userRole, loading, navigate]);

  // Fetch claims and users
 // Fetch claims and users
useEffect(() => {
  const fetchClaimsAndUsers = async () => {
    const { data: claimsData, error: claimsError } = await supabase
      .from("claims")
      .select("*")
      .order("created_at", { ascending: false });

    if (claimsError) {
      console.error("Error fetching claims:", claimsError.message);
      return;
    }

    setClaims(claimsData || []);

    // Extract unique user_ids
    const userIds = Array.from(new Set(claimsData?.map(c => c.user_id)));
    if (userIds.length === 0) return;

    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, full_name") // <-- make sure your users table has full_name
      .in("id", userIds);

    if (usersError) {
      console.error("Error fetching users:", usersError.message);
      return;
    }

    const map: Record<string, string> = {};
    usersData?.forEach(u => { map[u.id] = u.full_name || u.id; });
    setUsersMap(map);
  };

  fetchClaimsAndUsers();
}, []);

  const handleApprove = async () => {
    if (!selectedClaim) return;

    const { error } = await supabase
      .from("claims")
      .update({ status: "approved", agent_notes: actionNotes })
      .eq("id", selectedClaim.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Claim Approved", description: `Claim ${selectedClaim.claim_id} approved.` });
      setSelectedClaim(null);
      setActionNotes("");
      setClaims(prev => prev.map(c => c.id === selectedClaim.id ? { ...c, status: "approved" } : c));
    }
  };

  const handleReject = async () => {
    if (!selectedClaim) return;

    const { error } = await supabase
      .from("claims")
      .update({ status: "rejected", agent_notes: actionNotes })
      .eq("id", selectedClaim.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Claim Rejected", description: `Claim ${selectedClaim.claim_id} rejected.`, variant: "destructive" });
      setSelectedClaim(null);
      setActionNotes("");
      setClaims(prev => prev.map(c => c.id === selectedClaim.id ? { ...c, status: "rejected" } : c));
    }
  };

  const filteredClaims = claims.filter(claim => {
    const customerName = usersMap[claim.user_id] || claim.user_id;
    const matchesSearch = claim.claim_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || claim.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: claims.filter(c => c.status === "pending").length,
    inProgress: claims.filter(c => c.status === "in-progress").length,
    highRisk: claims.filter(c => c.fraud_score > 40).length,
    avgProcessingTime: "2.4 days", // optionally calculate dynamically
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || userRole !== "agent") return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-gold bg-clip-text text-transparent">Agent Dashboard</h1>
        <p className="text-muted-foreground mb-6">Review and process insurance claims</p>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-primary/20 hover:shadow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                <AlertCircle className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 hover:shadow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                <FileText className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 hover:shadow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                <AlertCircle className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold">{stats.highRisk}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 hover:shadow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                <TrendingUp className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Time</p>
                <p className="text-2xl font-bold">{stats.avgProcessingTime}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Claim ID or Customer Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Claims</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Claims Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Fraud Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.claim_id || claim.id}</TableCell>
                  <TableCell>{usersMap[claim.user_id] || claim.user_id}</TableCell>

                  {/* <TableCell className="font-medium">{claim.claim_id}</TableCell> */}
                  {/* <TableCell>{usersMap[claim.user_id] || claim.user_id}</TableCell> */}
                  <TableCell>{claim.type}</TableCell>
                  <TableCell><ClaimStatusBadge status={claim.status} /></TableCell>
                  <TableCell>₹{claim.amount?.toLocaleString()}</TableCell>
                  <TableCell className={claim.fraud_score > 40 ? "text-destructive font-semibold" : "text-success"}>
                    {claim.fraud_score}%
                  </TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelectedClaim(claim)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Claim Review Dialog */}
        <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Review Claim - {selectedClaim?.claim_id}</DialogTitle>
            </DialogHeader>
            {selectedClaim && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Customer</p>
                    <p className="font-semibold">{usersMap[selectedClaim.user_id] || selectedClaim.user_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Type</p>
                    <p className="font-semibold">{selectedClaim.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <p className="font-semibold text-primary">₹rs{selectedClaim.amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fraud Score</p>
                    <p className={`font-semibold ${selectedClaim.fraud_score > 40 ? "text-destructive" : "text-success"}`}>
                      {selectedClaim.fraud_score}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p>{selectedClaim.description}</p>
                </div>

                <WorkflowProgress currentStep={selectedClaim.workflow_step} />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">AI Analysis</p>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Damage Score</p>
                      <p className="text-2xl font-bold text-primary">{selectedClaim.damage_score ?? 0}%</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Estimated Payout</p>
                      <p className="text-2xl font-bold text-accent">${selectedClaim.estimated_payout?.toLocaleString() ?? 0}</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Fraud Risk</p>
                      <p className="text-2xl font-bold text-success">{selectedClaim.fraud_score ?? 0}%</p>
                    </Card>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Notes</p>
                  <Textarea
                    placeholder="Add your review notes..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedClaim(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject}><XCircle className="h-4 w-4 mr-2"/> Reject</Button>
              <Button className="bg-success hover:bg-success/90" onClick={handleApprove}><CheckCircle className="h-4 w-4 mr-2"/> Approve</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AgentDashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

// Mock data
const mockClaims = [
  {
    id: "CLM123456",
    customerName: "John Doe",
    type: "Auto Insurance",
    status: "pending" as const,
    date: "2025-09-28",
    amount: 4500,
    fraudScore: 12,
    workflowStep: 3,
    description: "Rear-end collision on Highway 101",
  },
  {
    id: "CLM123457",
    customerName: "Jane Smith",
    type: "Property Insurance",
    status: "in-progress" as const,
    date: "2025-09-27",
    amount: 8200,
    fraudScore: 8,
    workflowStep: 2,
    description: "Storm damage to roof",
  },
  {
    id: "CLM123458",
    customerName: "Mike Johnson",
    type: "Health Insurance",
    status: "pending" as const,
    date: "2025-09-26",
    amount: 3400,
    fraudScore: 45,
    workflowStep: 3,
    description: "Medical treatment",
  },
];

const AgentDashboard = () => {
  const { toast } = useToast();
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState<typeof mockClaims[0] | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  useEffect(() => {
    if (!loading && (!user || userRole !== "agent")) {
      navigate("/auth");
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!user || userRole !== "agent") {
    return null;
  }

  const handleApprove = () => {
    toast({
      title: "Claim Approved",
      description: `Claim ${selectedClaim?.id} has been approved for payment.`,
    });
    setSelectedClaim(null);
    setActionNotes("");
  };

  const handleReject = () => {
    toast({
      title: "Claim Rejected",
      description: `Claim ${selectedClaim?.id} has been rejected.`,
      variant: "destructive",
    });
    setSelectedClaim(null);
    setActionNotes("");
  };

  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || claim.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: mockClaims.filter(c => c.status === "pending").length,
    inProgress: mockClaims.filter(c => c.status === "in-progress").length,
    highRisk: mockClaims.filter(c => c.fraudScore > 40).length,
    avgProcessingTime: "2.4 days",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Agent Dashboard</h1>
          <p className="text-muted-foreground">Review and process insurance claims</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold">{stats.highRisk}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
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
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>{claim.customerName}</TableCell>
                  <TableCell>{claim.type}</TableCell>
                  <TableCell>
                    <ClaimStatusBadge status={claim.status} />
                  </TableCell>
                  <TableCell>${claim.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={claim.fraudScore > 40 ? "text-destructive font-semibold" : "text-success"}>
                      {claim.fraudScore}%
                    </span>
                  </TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedClaim(claim)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Claim Review Dialog */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Claim - {selectedClaim?.id}</DialogTitle>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer</p>
                  <p className="font-semibold">{selectedClaim.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="font-semibold">{selectedClaim.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="font-semibold text-primary">${selectedClaim.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fraud Score</p>
                  <p className={`font-semibold ${selectedClaim.fraudScore > 40 ? 'text-destructive' : 'text-success'}`}>
                    {selectedClaim.fraudScore}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p>{selectedClaim.description}</p>
              </div>

              <WorkflowProgress currentStep={selectedClaim.workflowStep} />

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
            <Button variant="outline" onClick={() => setSelectedClaim(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button className="bg-success hover:bg-success/90" onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentDashboard;

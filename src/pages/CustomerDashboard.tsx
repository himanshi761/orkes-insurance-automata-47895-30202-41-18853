import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClaimStatusBadge from "@/components/ClaimStatusBadge";
import WorkflowProgress from "@/components/WorkflowProgress";
import { FileText, Calendar, DollarSign, Eye, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data
const mockClaims = [
  {
    id: "CLM123456",
    type: "Auto Insurance",
    description: "Rear-end collision on Highway 101",
    date: "2025-09-28",
    amount: 4500,
    status: "in-progress" as const,
    workflowStep: 3,
    aiInsights: {
      damageScore: 75,
      fraudScore: 12,
      estimatedPayout: 4200,
    },
  },
  {
    id: "CLM123455",
    type: "Property Insurance",
    description: "Water damage from pipe burst",
    date: "2025-09-15",
    amount: 12000,
    status: "approved" as const,
    workflowStep: 5,
    aiInsights: {
      damageScore: 92,
      fraudScore: 5,
      estimatedPayout: 11500,
    },
  },
  {
    id: "CLM123454",
    type: "Health Insurance",
    description: "Emergency room visit",
    date: "2025-09-01",
    amount: 2800,
    status: "paid" as const,
    workflowStep: 5,
    aiInsights: {
      damageScore: 88,
      fraudScore: 3,
      estimatedPayout: 2800,
    },
  },
];

const CustomerDashboard = () => {
  const [selectedClaim, setSelectedClaim] = useState<typeof mockClaims[0] | null>(null);

  const stats = {
    total: mockClaims.length,
    inProgress: mockClaims.filter(c => c.status === "in-progress").length,
    approved: mockClaims.filter(c => c.status === "approved" || c.status === "paid").length,
    totalAmount: mockClaims.reduce((sum, c) => sum + c.amount, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Claims</h1>
            <p className="text-muted-foreground">Track and manage your insurance claims</p>
          </div>
          <Link to="/file-claim">
            <Button className="bg-gradient-hero">
              <Plus className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Recent Claims</h2>
          {mockClaims.map((claim) => (
            <Card key={claim.id} className="p-6 hover:shadow-medium transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{claim.id}</h3>
                    <ClaimStatusBadge status={claim.status} />
                  </div>
                  <p className="text-muted-foreground mb-1">{claim.type}</p>
                  <p className="text-sm">{claim.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${claim.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{claim.date}</p>
                </div>
              </div>

              <WorkflowProgress currentStep={claim.workflowStep} />

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Claim Details Dialog */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Claim Details - {selectedClaim?.id}</DialogTitle>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="font-semibold">{selectedClaim.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <ClaimStatusBadge status={selectedClaim.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date Filed</p>
                  <p className="font-semibold">{selectedClaim.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Claimed Amount</p>
                  <p className="font-semibold">${selectedClaim.amount.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p>{selectedClaim.description}</p>
              </div>

              <div>
                <p className="font-semibold mb-3">AI Analysis</p>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Damage Score</p>
                    <p className="text-2xl font-bold text-primary">
                      {selectedClaim.aiInsights.damageScore}%
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Fraud Risk</p>
                    <p className="text-2xl font-bold text-success">
                      {selectedClaim.aiInsights.fraudScore}%
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Est. Payout</p>
                    <p className="text-2xl font-bold text-accent">
                      ${selectedClaim.aiInsights.estimatedPayout.toLocaleString()}
                    </p>
                  </Card>
                </div>
              </div>

              <WorkflowProgress currentStep={selectedClaim.workflowStep} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;

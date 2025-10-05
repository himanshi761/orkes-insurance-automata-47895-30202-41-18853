import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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

const CustomerDashboard = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not a logged-in customer
  useEffect(() => {
    if (!loading && (!user || userRole !== "customer")) {
      navigate("/auth");
    }
  }, [user, userRole, loading, navigate]);

  // Fetch claims from Supabase
  const fetchClaims = async () => {
    setLoadingClaims(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("claims")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching claims:", error.message);
    } else {
      setClaims(data || []);
    }
    setLoadingClaims(false);
  };

  // Fetch on mount and also refetch if coming back from filing a claim
  useEffect(() => {
    fetchClaims();
  }, [location.state]);

  if (loading || loadingClaims) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || userRole !== "customer") {
    return null;
  }

  // Calculate summary stats dynamically
  const stats = {
    total: claims.length,
    inProgress: claims.filter((c) => c.status === "in-progress").length,
    approved: claims.filter((c) => c.status === "approved" || c.status === "paid").length,
    totalAmount: claims.reduce((sum, c) => sum + (Number(c.amount) || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-gold bg-clip-text text-transparent">
              My Claims
            </h1>
            <p className="text-muted-foreground">
              Track and manage your insurance claims
            </p>
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
          <Card className="p-6 border-primary/20 hover:shadow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                <FileText className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 hover:shadow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                <Calendar className="h-6 w-6 text-foreground" />
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
                <FileText className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 hover:shadow-gold transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
                <DollarSign className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">
                  ₹{stats.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Recent Claims</h2>
          {claims.length === 0 ? (
            <p className="text-muted-foreground">No claims found yet.</p>
          ) : (
            claims.map((claim) => (
              <Card
                key={claim.id}
                className="p-6 hover:shadow-medium transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">

                      <h3 className="text-lg font-semibold"><b>{claim.type} Insurance</b></h3>
                      <ClaimStatusBadge status={claim.status} />
                    </div>
                    <p className="text-muted-foreground mb-1">{claim.id}</p>
                    <p className="text-sm">{claim.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                      ₹{claim.amount?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{claim.date}</p>
                  </div>
                </div>

                <WorkflowProgress currentStep={claim.workflow_step || 1} />

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
            ))
          )}
        </div>
      </div>

      {/* Claim Details Dialog */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Claim Details - {selectedClaim?.claim_id || selectedClaim?.id}
            </DialogTitle>
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
                  <p className="text-sm text-muted-foreground mb-1">
                    Claimed Amount
                  </p>
                  <p className="font-semibold">
                    ${selectedClaim.amount?.toLocaleString()}
                  </p>
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
                    <p className="text-sm text-muted-foreground mb-1">
                      Damage Score
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {selectedClaim.damage_score ?? 0}%
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Fraud Risk</p>
                    <p className="text-2xl font-bold text-success">
                      {selectedClaim.fraud_score ?? 0}%
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Est. Payout
                    </p>
                    <p className="text-2xl font-bold text-accent">
                      ₹{selectedClaim.estimated_payout?.toLocaleString()}
                    </p>
                  </Card>
                </div>
              </div>

              <WorkflowProgress currentStep={selectedClaim.workflow_step || 1} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;

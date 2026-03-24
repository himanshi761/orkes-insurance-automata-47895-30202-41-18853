import { useState, useEffect } from "react";
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
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [loadingClaims, setLoadingClaims] = useState(true);

  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not customer
  // useEffect(() => {
  //   if (!loading && (!user || userRole !== "customer")) {
  //     navigate("/auth");
  //   }
  // }, [user, userRole, loading, navigate]);
//   useEffect(() => {
//   if (!loading && userRole && userRole !== "customer") {
//     navigate("/auth");
//   }
// }, [userRole, loading, navigate]);

  // 🔄 Fetch claims from MongoDB backend
  // const fetchClaims = async () => {
  //   try {
  //     setLoadingClaims(true);

  //     const token = localStorage.getItem("token"); // if using JWT

  //     const res = await fetch("/api/claims", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.message || "Failed to fetch claims");
  //     }

  //     setClaims(data || []);
  //   } catch (err) {
  //     console.error("Error fetching claims:", err.message);
  //   } finally {
  //     setLoadingClaims(false);
  //   }
  // };

  const fetchClaims = async () => {
  try {
    setLoadingClaims(true);

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/claims", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    

    const data = await res.json();
    console.log("Claims:",data)

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch claims");
    }

    setClaims(data || []);
  } catch (err) {
    console.error("Error fetching claims:", err.message);
  } finally {
    setLoadingClaims(false);
  }
};

  // Fetch on mount / refresh after new claim
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

  // if (!user || userRole !== "customer") {
  //   return null;
  // }

  // Stats
  const stats = {
    total: claims.length,
    inProgress: claims.filter((c) => c.status === "in-progress").length,
    approved: claims.filter(
      (c) => c.status === "approved" || c.status === "paid"
    ).length,
    totalAmount: claims.reduce(
      (sum, c) => sum + (Number(c.amount) || 0),
      0
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-yellow-600">
              My Claims
            </h1>
            <p className="text-muted-foreground">
              Track and manage your insurance claims
            </p>
          </div>

          <Link to="/file-claim">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </Link>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p>Total Claims</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </Card>

          <Card className="p-6">
            <p>In Progress</p>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
          </Card>

          <Card className="p-6">
            <p>Approved</p>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </Card>

          <Card className="p-6">
            <p>Total Amount</p>
            <p className="text-2xl font-bold">
              ₹{stats.totalAmount.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Claims */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Recent Claims</h2>

          {claims.length === 0 ? (
            <p>No claims found yet.</p>
          ) : (
            claims.map((claim) => (
              <Card key={claim._id} className="p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">
                      {claim.type} Insurance
                    </h3>
                    {/* <ClaimStatusBadge status={claim.status} /> */}
                    <p>Status: {claim.status}</p>
                    <p>{claim.description}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">
                      ₹{claim.amount?.toLocaleString()}
                    </p>
                    <p>{claim.date}</p>
                  </div>
                </div>

                <WorkflowProgress currentStep={claim.workflow_step || 1} />

                <div className="flex justify-end mt-4">
                  <Button onClick={() => setSelectedClaim(claim)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Dialog
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Claim Details - {selectedClaim?._id}
            </DialogTitle>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4">
              <p><b>Type:</b> {selectedClaim.type}</p>
              <p><b>Status:</b> {selectedClaim.status}</p>
              <p><b>Date:</b> {selectedClaim.date}</p>
              <p><b>Amount:</b> ₹{selectedClaim.amount}</p>
              <p>{selectedClaim.description}</p>

              <WorkflowProgress
                currentStep={selectedClaim.workflow_step || 1}
              />
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
  
};

export default CustomerDashboard;
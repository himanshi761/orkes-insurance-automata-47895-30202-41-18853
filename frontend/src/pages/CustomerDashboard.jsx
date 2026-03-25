import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WorkflowProgress from "@/components/WorkflowProgress";
import { Eye, Plus, FileText } from "lucide-react";

const CustomerDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);

  const { loading } = useAuth();
  const location = useLocation();

  // ✅ Fetch Claims
  const fetchClaims = async () => {
    try {
      setLoadingClaims(true);

      const res = await fetch("http://localhost:8000/api/claims");
      const data = await res.json();

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

  // ✅ Fetch documents for a claim
  const handleViewDetails = async (claim) => {
    setSelectedClaim(claim);

    try {
      const res = await fetch(
        `http://localhost:8000/api/claims/${claim._id}/documents`
      );

      const data = await res.json();
      setDocuments(data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [location.state]);

  if (loading || loadingClaims) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const stats = {
    total: claims.length,
    inProgress: claims.filter((c) => c.status === "in-progress").length,
    approved: claims.filter((c) => c.status === "approved").length,
    totalAmount: claims.reduce(
      (sum, c) => sum + (Number(c.amount) || 0),
      0
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">

        {/* Header */}
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

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <p>Total Claims</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </Card>

          <Card className="p-6 text-center">
            <p>In Progress</p>
            <p className="text-3xl font-bold">{stats.inProgress}</p>
          </Card>

          <Card className="p-6 text-center">
            <p>Approved</p>
            <p className="text-3xl font-bold">{stats.approved}</p>
          </Card>

          <Card className="p-6 text-center">
            <p>Total Amount</p>
            <p className="text-3xl font-bold">
              ₹{stats.totalAmount.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Recent Claims</h2>

          {claims.length === 0 ? (
            <div className="text-center py-10">
              <p>No claims yet 😕</p>
              <Link to="/file-claim">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  File Claim
                </Button>
              </Link>
            </div>
          ) : (
            claims.map((claim) => (
              <Card key={claim._id} className="p-6">
                <div className="flex justify-between mb-4">

                  <div>
                    <h3 className="font-semibold text-lg">
                      {claim.type} Insurance
                    </h3>

                    <p className="text-sm capitalize">
                      Status: {claim.status}
                    </p>

                    <p className="mt-2 text-sm">
                      {claim.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">
                      ₹{claim.amount}
                    </p>
                    <p>
                      {new Date(claim.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <WorkflowProgress
                  currentStep={claim.workflow_step || 1}
                />

                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(claim)}
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

      {/* 🔥 MODAL */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[420px]">

            <h2 className="text-xl font-bold mb-4">
              Claim Details
            </h2>

            <p><b>Type:</b> {selectedClaim.type}</p>
            <p><b>Status:</b> {selectedClaim.status}</p>
            <p><b>Date:</b> {selectedClaim.date}</p>
            <p><b>Amount:</b> ₹{selectedClaim.amount}</p>
            <p className="mt-2">{selectedClaim.description}</p>

            {/* 🔥 DOCUMENTS */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Documents</h3>

              {documents.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No documents uploaded
                </p>
              ) : (
                documents.map((doc) => (
                  <a
                    key={doc._id}
                    href={`http://localhost:8000/${doc.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    View File
                  </a>
                ))
              )}
            </div>

            <button
              className="mt-6 w-full bg-black text-white py-2 rounded"
              onClick={() => {
                setSelectedClaim(null);
                setDocuments([]);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
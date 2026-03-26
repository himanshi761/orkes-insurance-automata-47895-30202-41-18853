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
import WorkflowProgress from "@/components/WorkflowProgress";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const AgentDashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [actionNotes, setActionNotes] = useState("");

  // 🔥 FETCH CLAIMS
  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/claims", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setClaims(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  useEffect(() => {
    if (!loading && userRole !== "agent") {
      console.log(userRole);
      navigate("/auth");
    }
  }, [userRole, loading]);

  if (loading) return <div>Loading...</div>;

  // 🔥 APPROVE / REJECT
  const updateStatus = async (status) => {
    try {
      await fetch(
        `http://localhost:8000/api/claims/${selectedClaim._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            notes: actionNotes,
          }),
        }
      );

      setSelectedClaim(null);
      setActionNotes("");
      fetchClaims(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClaims = claims.filter((c) => {
    const matchSearch =
      c.policyNumber?.includes(searchTerm) ||
      c.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "all" || c.status === filterStatus;

    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">

        <h1 className="text-4xl font-bold mb-6">
          Agent Dashboard
        </h1>

        {/* FILTER */}
        <Card className="p-6 mb-6 flex gap-4">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* TABLE */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredClaims.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.policyNumber}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.status}</TableCell>
                  <TableCell>₹{c.amount}</TableCell>
                  <TableCell>
                    {new Date(c.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button onClick={() => setSelectedClaim(c)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* 🔥 MODAL */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[500px]">

            <h2 className="text-xl font-bold mb-4">
              Review Claim
            </h2>

            <p><b>Type:</b> {selectedClaim.type}</p>
            <p><b>Amount:</b> ₹{selectedClaim.amount}</p>
            <p><b>Status:</b> {selectedClaim.status}</p>
            <p className="mt-2">{selectedClaim.description}</p>

            <WorkflowProgress
              currentStep={selectedClaim.workflow_step || 1}
            />

            <Textarea
              placeholder="Add notes..."
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              className="mt-4"
            />

            <div className="flex gap-2 mt-4">
              <Button
                variant="destructive"
                onClick={() => updateStatus("rejected")}
              >
                <XCircle className="mr-2" /> Reject
              </Button>

              <Button
                onClick={() => updateStatus("approved")}
              >
                <CheckCircle className="mr-2" /> Approve
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
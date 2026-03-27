import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClaimStatusBadge from "@/components/ClaimStatusBadge";

const AdminClaims = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/claims", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("CLAIMS:", data);

      setClaims(data);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Claims</h1>

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
            {claims.length > 0 ? (
              claims.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.policyNumber || "-"}</TableCell>

                  {/* ✅ USER FIX */}
                  <TableCell>
                    {c.user?.name || c.user?.email || "Unknown"}
                  </TableCell>

                  <TableCell>
                    <ClaimStatusBadge status={c.status} />
                  </TableCell>

                  <TableCell>₹{c.amount || 0}</TableCell>

                  <TableCell>
                    {c.date
                      ? new Date(c.date).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No Claims Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminClaims;
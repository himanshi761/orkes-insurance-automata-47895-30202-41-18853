import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FileClaim = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [files, setFiles] = useState(null);
  const [claimType, setClaimType] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!claimType || !policyNumber || !incidentDate || !description) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
      });
      return;
    }

    const formData = new FormData();

    formData.append("type", claimType);
    formData.append("policyNumber", policyNumber);
    formData.append("date", incidentDate);
    formData.append("description", description);
    formData.append("amount", amount || 0);

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("documents", file);
      });
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/claims", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      toast({
        title: "Success 🎉",
        description: "Claim submitted successfully!",
      });

      // reset form
      setClaimType("");
      setPolicyNumber("");
      setIncidentDate("");
      setDescription("");
      setAmount("");
      setFiles(null);

      navigate("/customer", { state: { refresh: true } });

    } catch (err) {
      console.error(err);
      toast({
        title: "Error ❌",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              File a New Claim
            </h1>
            <p className="text-muted-foreground">
              Complete the form below to submit your insurance claim
            </p>
          </div>

          {/* Form Card */}
          <Card className="p-8 shadow-lg rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Claim Type */}
              <div className="space-y-2">
                <Label>Claim Type *</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                >
                  <option value="">Select claim type</option>
                  <option value="Health">Health</option>
                  <option value="Auto">Auto</option>
                  <option value="Property">Property</option>
                  <option value="Life">Life</option>
                </select>
              </div>

              {/* Policy Number */}
              <div className="space-y-2">
                <Label >Policy Number *</Label>
                <Input className="w-full border rounded-md p-2"
                  placeholder="Enter your policy number"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Date of Incident *</Label>
                <Input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  placeholder="Describe what happened..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label>Estimated Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload Documents</Label>

                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-yellow-500 transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    id="fileUpload"
                    onChange={(e) => setFiles(e.target.files)}
                  />

                  <label htmlFor="fileUpload">
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Click to upload or drag files
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, PDF (Max 10MB)
                    </p>
                  </label>
                </div>

                {files && files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {Array.from(files).map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md">
                        <FileText className="h-4 w-4" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/customer")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Claim"}
                </Button>
              </div>

            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FileClaim;
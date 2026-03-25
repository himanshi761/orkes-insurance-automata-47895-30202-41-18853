import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { supabase } from "@/supabaseClient";
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
// import OpenAI from "openai";

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

//   const client = new OpenAI({
//     apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//     dangerouslyAllowBrowser: true,
//   });

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("type", claimType);
  formData.append("policyNumber", policyNumber);
  formData.append("date", incidentDate);
  formData.append("description", description);
  formData.append("amount", amount || 0);

  // 🔥 CRITICAL FIX
  if (files) {
    Array.from(files).forEach((file) => {
      formData.append("documents", file); // MUST match multer
    });
  }

  try {
    const res = await fetch("http://localhost:8000/api/claims", {
      method: "POST",
      body: formData, // ✅ DO NOT add headers
    });

    const data = await res.json();
    console.log("Response:", data);

  } catch (err) {
    console.error("Error:", err);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              File a New Claim
            </h1>
            <p className="text-muted-foreground">
              Submit your insurance claim
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              
              <Input
                placeholder="Policy Number"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
              />

              <Textarea
                placeholder="Describe incident..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FileClaim;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/supabaseClient";
// import Navigation from "@/components/Navigation";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Upload, FileText } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const FileClaim = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [files, setFiles] = useState<FileList | null>(null);
//   const [claimType, setClaimType] = useState("");
//   const [policyNumber, setPolicyNumber] = useState("");
//   const [incidentDate, setIncidentDate] = useState("");
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState<number | "">("");
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Get current user
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (!user) {
//       toast({ title: "Error", description: "User not logged in" });
//       return;
//     }

//     // Insert claim into Supabase
//     const { data, error } = await supabase.from("claims").insert([
//       {
//         user_id: user.id,
//         type: claimType,
//         policy_number: policyNumber,
//         description,
//         amount: amount || 0,
//         date: incidentDate,
//         status: "in-progress",
//         workflow_step: 1,
//       },
//     ]);

//     if (error) {
//       toast({ title: "Error", description: error.message });
//       return;
//     }

//     toast({
//       title: "Claim Submitted Successfully!",
//       description: `Your claim has been submitted and is being processed.`,
//     });

//     // Navigate back to dashboard and trigger refresh
//     navigate("/customer", { state: { refresh: true } });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />

//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-3xl mx-auto">
//           <div className="text-center mb-8 animate-fade-in">
//             <h1 className="text-4xl font-bold mb-2 bg-gradient-gold bg-clip-text text-transparent">
//               File a New Claim
//             </h1>
//             <p className="text-muted-foreground">
//               Complete the form below to submit your insurance claim
//             </p>
//           </div>

//           <Card className="p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Claim Type */}
//               <div className="space-y-2">
//                 <Label htmlFor="claimType">Claim Type *</Label>
//                 <Select
//                   value={claimType}
//                   onValueChange={(val) => setClaimType(val)}
//                   required
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select claim type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="auto">Auto Insurance</SelectItem>
//                     <SelectItem value="health">Health Insurance</SelectItem>
//                     <SelectItem value="property">Property Insurance</SelectItem>
//                     <SelectItem value="life">Life Insurance</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Policy Number */}
//               <div className="space-y-2">
//                 <Label htmlFor="policyNumber">Policy Number *</Label>
//                 <Input
//                   id="policyNumber"
//                   placeholder="Enter your policy number"
//                   value={policyNumber}
//                   onChange={(e) => setPolicyNumber(e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Incident Date */}
//               <div className="space-y-2">
//                 <Label htmlFor="incidentDate">Date of Incident *</Label>
//                 <Input
//                   id="incidentDate"
//                   type="date"
//                   value={incidentDate}
//                   onChange={(e) => setIncidentDate(e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <Label htmlFor="description">Description *</Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Provide details about what happened..."
//                   rows={5}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Estimated Amount */}
//               <div className="space-y-2">
//                 <Label htmlFor="amount">Estimated Claim Amount (₹)</Label>
//                 <Input
//                   id="amount"
//                   type="number"
//                   placeholder="0.00"
//                   min="0"
//                   step="0.01"
//                   value={amount}
//                   onChange={(e) => setAmount(Number(e.target.value))}
//                 />
//               </div>

//               {/* File Upload */}
//               <div className="space-y-2">
//                 <Label htmlFor="documents">Upload Documents/Photos</Label>
//                 <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
//                   <input
//                     id="documents"
//                     type="file"
//                     multiple
//                     accept="image/*,.pdf"
//                     className="hidden"
//                     onChange={(e) => setFiles(e.target.files)}
//                   />
//                   <label htmlFor="documents" className="cursor-pointer">
//                     <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                     <p className="text-sm text-muted-foreground mb-2">
//                       Click to upload or drag and drop
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       PNG, JPG, PDF up to 10MB each
//                     </p>
//                   </label>
//                 </div>
//                 {files && files.length > 0 && (
//                   <div className="mt-4 space-y-2">
//                     {Array.from(files).map((file, index) => (
//                       <div key={index} className="flex items-center gap-2 text-sm">
//                         <FileText className="h-4 w-4 text-muted-foreground" />
//                         <span>{file.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <div className="flex gap-4 pt-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => navigate("/")}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="flex-1 bg-gradient-hero"
//                 >
//                   Submit Claim
//                 </Button>
//               </div>
//             </form>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileClaim;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OpenAI from "openai"; // ✅ added

const FileClaim = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileList | null>(null);
  const [claimType, setClaimType] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  // ✅ Initialize OpenAI client
  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!claimType || !policyNumber || !incidentDate || !description) {
    toast({
      title: "Missing Information",
      description: "Please fill all required fields before submitting.",
    });
    return;
  }

  // ✅ Validate uploaded files before submitting
  if (files && files.length > 0) {
    for (const file of Array.from(files)) {
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid Document Type",
          description: `${file.name} is not a valid format. Please upload PNG, JPG, or PDF files.`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 10MB. Please upload a smaller file.`,
          variant: "destructive",
        });
        return;
      }
    }
  }

  setLoading(true);

  try {
    // Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error("User not logged in.");

    // Insert claim record
    const { data: claimData, error: claimError } = await supabase
      .from("claims")
      .insert([
        {
          user_id: user.id,
          type: claimType,
          policy_number: policyNumber,
          description,
          amount: amount || 0,
          date: incidentDate,
          status: "in-progress",
          workflow_step: 1,
        },
      ])
      .select()
      .single();

    if (claimError) throw claimError;

    // Upload files
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const filePath = `${user.id}/${claimData.id}/${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("claim-documents")
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          toast({
            title: "Invalid Document Detected",
            description: `Could not verify ${file.name}. Please re-upload a valid document.`,
            variant: "destructive",
          });
          return;
        }

        await supabase.from("claim_files").insert([
          { claim_id: claimData.id, file_path: filePath, file_name: file.name },
        ]);
      }
    }

    toast({
      title: "Claim Submitted ✅",
      description: "Your claim and documents have been submitted for review.",
    });

    navigate("/customer", { state: { refresh: true } });
  } catch (err: any) {
    // ✅ Friendly failure messages instead of "AI screening failed"
    const message =
      err.message.includes("screening")
        ? "One or more documents could not be verified. Please upload valid proofs."
        : err.message;

    toast({
      title: "Submission Error",
      description: message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const {
  //     data: { user },
  //     error: userError,
  //   } = await supabase.auth.getUser();

  //   if (!user) {
  //     toast({ title: "Error", description: "User not logged in" });
  //     setLoading(false);
  //     return;
  //   }

  //   // Step 1️⃣: Insert claim into Supabase
  //   const { data, error } = await supabase
  //     .from("claims")
  //     .insert([
  //       {
  //         user_id: user.id,
  //         type: claimType,
  //         policy_number: policyNumber,
  //         description,
  //         amount: amount || 0,
  //         date: incidentDate,
  //         status: "pending",
  //         workflow_step: 1,
  //       },
  //     ])
  //     .select()
  //     .single();

  //   if (error) {
  //     toast({ title: "Error", description: error.message });
  //     setLoading(false);
  //     return;
  //   }

  //   // Step 2️⃣: Run AI analysis
  //   try {
  //     const prompt = `
  //     Analyze the following insurance claim and give:
  //     1. Fraud probability (0-100)
  //     2. Damage severity (0-100)
  //     3. Estimated payout (₹)
  //     4. Short summary of the claim

  //     Claim details:
  //     Type: ${claimType}
  //     Policy Number: ${policyNumber}
  //     Amount: ₹${amount}
  //     Date: ${incidentDate}
  //     Description: ${description}
  //     `;

  //     const response = await client.chat.completions.create({
  //       model: "gpt-4o-mini",
  //       messages: [{ role: "user", content: prompt }],
  //     });

  //     const text = response.choices[0].message.content || "";

  //     const fraudMatch = text.match(/Fraud.*?(\d{1,3})/i);
  //     const damageMatch = text.match(/Damage.*?(\d{1,3})/i);
  //     const payoutMatch = text.match(/Payout.*?(\d+)/i);

  //     const fraudScore = fraudMatch ? Number(fraudMatch[1]) : 0;
  //     const damageScore = damageMatch ? Number(damageMatch[1]) : 0;
  //     const estimatedPayout = payoutMatch ? Number(payoutMatch[1]) : 0;

  //     // Step 3️⃣: Update claim with AI results
  //     await supabase
  //       .from("claims")
  //       .update({
  //         fraud_score: fraudScore,
  //         damage_score: damageScore,
  //         estimated_payout: estimatedPayout,
  //         status: fraudScore > 50 ? "high-risk" : "in-progress",
  //         workflow_step: 2,
  //       })
  //       .eq("id", data.id);

  //     toast({
  //       title: "Claim Submitted & Analyzed!",
  //       description:
  //         fraudScore > 50
  //           ? `⚠️ This claim was flagged as potentially fraudulent (score: ${fraudScore}%)`
  //           : `✅ Claim analyzed successfully! Fraud score: ${fraudScore}%, Damage: ${damageScore}%`,
  //     });
  //   } catch (err) {
  //     console.error("AI screening failed:", err);
  //     toast({ title: "AI Error", description: "AI screening failed. Please try again later." });
  //   }

  //   setLoading(false);

  //   // Step 4️⃣: Redirect to dashboard
  //   navigate("/customer", { state: { refresh: true } });
  // };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-gold bg-clip-text text-transparent">
              File a New Claim
            </h1>
            <p className="text-muted-foreground">
              Complete the form below to submit your insurance claim
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Claim Type */}
              <div className="space-y-2">
                <Label htmlFor="claimType">Claim Type *</Label>
                <Select value={claimType} onValueChange={(val) => setClaimType(val)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto Insurance</SelectItem>
                    <SelectItem value="health">Health Insurance</SelectItem>
                    <SelectItem value="property">Property Insurance</SelectItem>
                    <SelectItem value="life">Life Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Policy Number */}
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number *</Label>
                <Input
                  id="policyNumber"
                  placeholder="Enter your policy number"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  required
                />
              </div>

              {/* Incident Date */}
              <div className="space-y-2">
                <Label htmlFor="incidentDate">Date of Incident *</Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about what happened..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Estimated Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Estimated Claim Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="documents">Upload Documents/Photos</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    id="documents"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </label>
                </div>
                {files && files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {Array.from(files).map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-hero" disabled={loading}>
                  {loading ? "Processing..." : "Submit Claim"}
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

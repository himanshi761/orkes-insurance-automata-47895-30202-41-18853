import Claim from "../model/claimModel.js";
import Document from "../model/documentSchema.js";
// ✅ GET all claims
export const getClaims = async (req, res) => {
  try {
    const claims = await Claim.find().sort({
      createdAt: -1,
    });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claims" });
  }
};


export const createClaim = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    const { type, policyNumber, date, description, amount } = req.body;
    
    // ✅ Step 1: Create claim
    const newClaim = new Claim({
      type,
      policyNumber,
      date,
      description,
      amount,
      status: "in-progress",
      workflow_step: 1,
    });

    await newClaim.save();

    // ✅ Step 2: Save uploaded files into Document collection
    if (req.files && req.files.length > 0) {
      const documents = req.files.map((file) => ({
        claim: newClaim._id,
        fileUrl: file.path, // local path (or later cloud URL)
        fileType: file.mimetype,
      }));

      await Document.insertMany(documents);
    }

    res.status(201).json(newClaim);

  } catch (error) {
    console.error("Error creating claim:", error);
    res.status(500).json({ message: "Error creating claim" });
  }
};
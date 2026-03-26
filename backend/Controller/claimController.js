import Claim from "../model/claimModel.js";
import Document from "../model/documentSchema.js";


// ✅ GET USER CLAIMS (FIXED 🔥)
export const getClaims = async (req, res) => {
  try {
    let claims;

    console.log("USER ROLE:", req.user.role); // 🔥 DEBUG

    if (req.user.role === "customer") {
      claims = await Claim.find({ user: req.user.userId });
    } else {
      claims = await Claim.find(); // 🔥 ALL CLAIMS
    }

    res.json(claims);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET DOCUMENTS
export const getClaimDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const documents = await Document.find({ claim: id });

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching documents" });
  }
};


// ✅ CREATE CLAIM (FIXED 🔥 USER LINKED)
export const createClaim = async (req, res) => {
  try {
    const { type, policyNumber, date, description, amount } = req.body;

    const newClaim = new Claim({
      user: req.user._id, // 🔥 IMPORTANT FIX
      type,
      policyNumber,
      date,
      description,
      amount,
      status: "in-progress",
      workflow_step: 1,
    });

    await newClaim.save();

    // ✅ SAVE DOCUMENTS
    if (req.files && req.files.length > 0) {
      const documents = req.files.map((file) => ({
        claim: newClaim._id,
        fileUrl: file.path,
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


// ✅ UPDATE STATUS (AGENT)
export const updateClaimStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        status,
        agentNotes: notes,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
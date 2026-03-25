import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  type: String,

  policyNumber: String, // 🔥 ADD THIS (you are using it in frontend)

  status: {
    type: String,
    enum: ["pending", "assigned", "approved", "rejected", "in-progress"],
    default: "pending"
  },

  amount: Number,

  description: String,

  date: String,

  workflow_step: {
    type: Number,
    default: 1 // 🔥 good practice
  },

  aiResult: {
    type: mongoose.Schema.Types.Mixed
  },

  // 🔥 ADD THIS (VERY IMPORTANT for agent dashboard)
  agentNotes: {
    type: String,
    default: ""
  },

  // 🔥 OPTIONAL BUT USEFUL (documents linking)
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document"
    }
  ],

  assignedAt: Date,
  reviewedAt: Date

}, { timestamps: true });

export default mongoose.model("Claim", claimSchema);
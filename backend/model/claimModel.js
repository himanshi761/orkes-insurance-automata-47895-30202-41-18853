import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // make optional for now
  },

  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  type: String, // ✅ ADD THIS

  status: {
    type: String,
    enum: ["pending", "assigned", "approved", "rejected", "in-progress"], // ✅ add this
    default: "pending"
  },

  amount: Number,

  description: String,

  date: String, // ✅ ADD THIS

  workflow_step: Number, // ✅ ADD THIS

  aiResult: {
    type: mongoose.Schema.Types.Mixed
  },

  assignedAt: Date,
  reviewedAt: Date

}, { timestamps: true });

export default mongoose.model("Claim", claimSchema);
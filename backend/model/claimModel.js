import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },

  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // agent is also a user with role="agent"
    default: null
  },

  status: {
    type: String,
    enum: ["pending","assigned", "approved", "rejected"],
    default: "pending"
  },

  amount: Number,

  description: String,

  aiResult: {
    type: mongoose.Schema.Types.Mixed
  },

  assignedAt: Date,
  reviewedAt: Date

}, { timestamps: true });

export default mongoose.model("Claim", claimSchema);
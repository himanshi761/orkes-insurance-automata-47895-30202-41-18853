import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  claim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Claim",
    required:true
  },

  fileUrl: {
    type: String,
    required: true
  },

  fileType: {
    type: String,
    required: true
  },


  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
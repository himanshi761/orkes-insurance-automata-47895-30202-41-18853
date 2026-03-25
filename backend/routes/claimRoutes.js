import express from "express";
import multer from "multer";
import { getClaims, createClaim, getClaimDocuments } from "../Controller/claimController.js";
import path from "path";
import Document from "../model/documentSchema.js";

// import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 Configure multer (for file uploads)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ GET all claims
router.get("/claims", getClaims);
router.get("/claims/:id/documents", getClaimDocuments);
// ✅ POST new claim (WITH FILES)
router.post(
  "/claims",
  upload.array("documents"), // 👈 must match frontend
  createClaim
);

export default router;
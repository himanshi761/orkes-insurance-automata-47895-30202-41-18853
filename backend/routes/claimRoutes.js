import express from "express";
import multer from "multer";
import {
  getClaims,
  createClaim,
  getClaimDocuments,
  updateClaimStatus
} from "../Controller/claimController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 Multer config
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


// ================= ROUTES =================

// ✅ Get ONLY logged-in user's claims
router.get("/claims", protect, getClaims);

// ✅ Create claim (with file upload + user auth)
router.post(
  "/claims",
  protect,
  upload.array("documents"), // 🔥 important: frontend must match this name
  createClaim
);

// ✅ Get documents of a claim
router.get("/claims/:id/documents", protect, getClaimDocuments);

// ✅ Agent updates claim status
router.put("/claims/:id/status", protect, updateClaimStatus);

export default router;
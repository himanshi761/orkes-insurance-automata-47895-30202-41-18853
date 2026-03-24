import express from "express";
import multer from "multer";
import { getClaims, createClaim } from "../Controller/claimController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 Configure multer (for file uploads)
const upload = multer({ dest: "uploads/" });

// ✅ GET all claims
router.get("/claims", getClaims);

// ✅ POST new claim (WITH FILES)
router.post(
  "/claims",
  upload.array("documents"), // 👈 must match frontend
  createClaim
);

export default router;
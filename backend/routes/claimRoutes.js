import express from "express";
import { getClaims } from "../Controller/claimController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all claims for logged-in user
router.get("/claims", getClaims);

export default router;
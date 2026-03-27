// import express from "express";
// import User from "../model/userModel.js";

// const router = express.Router();

// // ✅ GET ALL USERS
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users" });
//   }
// });

// export default router;

import express from "express";
import User from "../model/userModel.js";

const router = express.Router();

// ✅ GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ GET ONLY CLIENTS (CUSTOMERS)
router.get("/clients", async (req, res) => {
  try {
    const clients = await User.find({ role: "customer" }).select(
      "name email createdAt"
    );

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients" });
  }
});

export default router;

// ✅ GET ONLY AGENTS
router.get("/agents", async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select(
      "name email createdAt"
    );

    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents" });
  }
});
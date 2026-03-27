// controllers/userController.js

import User from "../model/userModel.js";

// ✅ GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ✅ GET ONLY CLIENTS (CUSTOMERS)
export const getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "customer" }).select(
      "name email createdAt"
    );

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients" });
  }
};

// controller
export const getClaimDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const documents = await Document.find({ claim: id })
      .populate({
        path: "claim",
        populate: {
          path: "user",
          select: "_id",
        },
      });

    // 🔥 filter only logged-in user's docs
    const filteredDocs = documents.filter(
      (doc) => doc.claim.user._id.toString() === req.user.userId
    );

    res.json(filteredDocs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};
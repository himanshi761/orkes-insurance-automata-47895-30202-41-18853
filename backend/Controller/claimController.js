import Claim from "../model/claimModel.js";

export const getClaims = async (req, res) => {
  try {
    const claims = await Claim.find().sort({
      createdAt: -1,
    });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claims" });
  }
};
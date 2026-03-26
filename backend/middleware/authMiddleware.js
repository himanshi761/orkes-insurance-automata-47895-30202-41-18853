import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // 🔥 now has userId + role

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
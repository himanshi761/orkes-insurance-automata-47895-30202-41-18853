export const isAgent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "agent") {
    return res.status(403).json({ message: "Access denied: Agents only" });
  }

  next();
};
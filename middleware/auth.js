import jwt from "jsonwebtoken";

// Protects admin-only routes. Expects: Authorization: Bearer <token from /api/login>
export const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Session expired, please log in again" });
  }
};

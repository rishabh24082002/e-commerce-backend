import { verifyJwt } from "../utils/jwt.js";
import { findUserById } from "../models/user.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing token" });
  const token = authHeader.split(" ")[1];
  const payload = verifyJwt(token);
  if (!payload || !payload.sub)
    return res.status(401).json({ error: "Invalid token" });
  const user = await findUserById(payload.sub);
  if (!user) return res.status(401).json({ error: "User not found" });
  req.user = user;
  next();
};

export const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!allowed.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
};

import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized, token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: "Admin only" });

    req.admin = decoded; 
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyAdmin;
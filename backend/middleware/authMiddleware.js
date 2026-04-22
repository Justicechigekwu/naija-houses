import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || typeof authHeader !== "string") {
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7).trim();
};

const verifyToken = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token || null;
    const bearerToken = extractBearerToken(req);

    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({
        code: "ACCOUNT_BANNED",
        message:
          user.banReason ||
          "Your account has been banned for violating marketplace standards.",
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      provider: user.provider,
      authSource: bearerToken ? "bearer" : "cookie",
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default verifyToken;
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    
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
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default verifyToken;
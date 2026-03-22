import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Unauthorized: token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select(
      "_id firstName lastName email avatar isBanned banReason"
    );

    if (!user) {
      return next(new Error("Unauthorized: user not found"));
    }

    if (user.isBanned) {
      return next(new Error("ACCOUNT_BANNED"));
    }

    socket.user = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      isAdmin: !!decoded.isAdmin,
    };

    next();
  } catch (error) {
    next(new Error("Unauthorized: invalid token"));
  }
};
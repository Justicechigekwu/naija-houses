import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const getCookieValue = (cookieHeader = "", name) => {
  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
};

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const authToken =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    const cookieToken = getCookieValue(socket.handshake.headers?.cookie, "token");

    const token = authToken || cookieToken;

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
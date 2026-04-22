import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { generateUniqueUserSlug } from "../utils/userSlug.js";
import { sendAuthResponse } from "../utils/sendAuthResponse.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.isBanned) {
        return res.status(403).json({
          code: "ACCOUNT_BANNED",
          message:
            existingUser.banReason ||
            "This email has been banned from using the marketplace.",
        });
      }

      return res.status(400).json({ message: "User already exists" });
    }

    const slug = await generateUniqueUserSlug(userModel, {
      firstName,
      lastName,
    });

    const newUser = new userModel({
      firstName,
      lastName,
      slug,
      email: normalizedEmail,
      password,
      provider: "local",
    });

    await newUser.save();

    return sendAuthResponse({
      req,
      res,
      user: newUser,
      statusCode: 201,
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.isBanned) {
      return res.status(403).json({
        code: "ACCOUNT_BANNED",
        message:
          user.banReason ||
          "Your account has been banned for violating marketplace standards.",
      });
    }

    if (user.provider === "google" && !user.password) {
      return res.status(400).json({
        message: "This account was created with Google. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return sendAuthResponse({
      req,
      res,
      user,
      statusCode: 200,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        slug: user.slug,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar || null,
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        dob: user.dob || "",
        sex: user.sex || "",
        provider: user.provider,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};
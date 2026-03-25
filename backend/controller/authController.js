import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import generateToken from "../utils/generateTokenUtils.js";
import setTokenCookie from "../utils/setTokenCookies.js";

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

    const newUser = new userModel({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      provider: "local",
    });

    await newUser.save();

    const token = generateToken(newUser._id, { provider: newUser.provider });
    setTokenCookie(res, token);

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        avatar: newUser.avatar || null,
        provider: newUser.provider,
      },
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

    const token = generateToken(user._id, { provider: user.provider });
    setTokenCookie(res, token);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar || null,
        provider: user.provider,
      },
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

    return res.status(200).json({ message: "Logged out successfully" });
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
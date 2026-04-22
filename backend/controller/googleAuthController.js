import { OAuth2Client } from "google-auth-library";
import userModel from "../models/userModel.js";
import { sendAuthResponse } from "../utils/sendAuthResponse.js";
import { generateUniqueUserSlug } from "../utils/userSlug.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    const {
      sub,
      email,
      given_name,
      family_name,
      picture,
      email_verified,
    } = payload;

    if (!email || !email_verified) {
      return res.status(400).json({ message: "Google email is not verified" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await userModel.findOne({
      $or: [{ googleId: sub }, { email: normalizedEmail }],
    });

    if (!user) {
      const slug = await generateUniqueUserSlug(userModel, {
        firstName: given_name || "Google",
        lastName: family_name || "User",
      });

      user = await userModel.create({
        firstName: given_name || "Google",
        lastName: family_name || "User",
        slug,
        email: normalizedEmail,
        googleId: sub,
        provider: "google",
        avatar: picture || "",
      });
    } else {
      if (user.isBanned) {
        return res.status(403).json({
          code: "ACCOUNT_BANNED",
          message:
            user.banReason ||
            "Your account has been banned for violating marketplace standards.",
        });
      }

      if (!user.googleId) user.googleId = sub;
      if (!user.avatar && picture) user.avatar = picture;

      if (!user.slug) {
        user.slug = await generateUniqueUserSlug(userModel, {
          firstName: user.firstName || "Google",
          lastName: user.lastName || "User",
        }, user._id);
      }

      await user.save();
    }

    return sendAuthResponse({
      req,
      res,
      user,
      statusCode: 200,
      message: "Google login successful",
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
};
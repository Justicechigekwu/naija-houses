
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/userModel.js";
import generateToken from "../utils/generateTokenUtils.js";
import setTokenCookie from "../utils/setTokenCookies.js";

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
      user = await userModel.create({
        firstName: given_name || "Google",
        lastName: family_name || "User",
        email: normalizedEmail,
        googleId: sub,
        provider: "google",
        avatar: picture || "",
      });
    } else {
      if (!user.googleId) user.googleId = sub;
      if (!user.avatar && picture) user.avatar = picture;
      await user.save();
    }

    const token = generateToken(user._id, { provider: user.provider });
    setTokenCookie(res, token);

    return res.status(200).json({
      message: "Google login successful",
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
    console.error("Google auth error:", error);
    return res.status(500).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
};
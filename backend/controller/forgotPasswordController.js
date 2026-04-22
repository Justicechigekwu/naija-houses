import userModel from '../models/userModel.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmailsUtils.js'; 
import rateLimit from "express-rate-limit";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    const text = `You requested a password reset.\n\nUse the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Reset your password</h2>
        <p>You requested a password reset for your Velora account.</p>
        <p>
          <a
            href="${resetUrl}"
            style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;"
          >
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 15 minutes.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset your Velora password",
      text,
      html,
    });

    return res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};


export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many password reset requests. Try again later.",
});


export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

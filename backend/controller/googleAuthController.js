import { OAuth2Client } from 'google-auth-library';
import userModel from '../models/userModel.js';
import generateToken from '../utils/generateTokenUtils.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    const {
      sub,
      email,
      given_name,
      family_name,
      picture,
      email_verified
    } = payload;

    if (!email || !email_verified) {
      return res.status(400).json({ message: 'Google email is not verified' });
    }

    let user = await userModel.findOne({
      $or: [{ googleId: sub }, { email }]
    });

    if (!user) {
      user = await userModel.create({
        firstName: given_name || 'Google',
        lastName: family_name || 'User',
        email,
        googleId: sub,
        provider: 'google',
        avatar: picture || ''
      });
    } else {
      if (!user.googleId) user.googleId = sub;
      if (user.provider !== 'google' && !user.googleId) {
        user.googleId = sub;
      }

      // Optional: update avatar from Google if user has none
      if (!user.avatar && picture) {
        user.avatar = picture;
      }

      await user.save();
    }

    const token = generateToken(user._id, { provider: user.provider });

    return res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar || null,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({
      message: 'Google authentication failed',
      error: error.message
    });
  }
};
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import Listing from "../models/listingModels.js";
import Review from "../models/reviewModel.js";
import mongoose from "mongoose";
import { generateUniqueUserSlug } from "../utils/userSlug.js";

export const updateProfile = async (req, res) => {
  try {

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await userModel.findOne({ email: req.body.email });

      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      user.email = req.body.email;
    }

    const nextFirstName = req.body.firstName || user.firstName;
    const nextLastName = req.body.lastName || user.lastName;

    user.firstName = nextFirstName;
    user.lastName = nextLastName;
    user.slug = await generateUniqueUserSlug(
      userModel,
      {
        firstName: nextFirstName,
        lastName: nextLastName,
      },
      user._id
    );
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;
    user.bio = req.body.bio || user.bio;
    user.dob = req.body.dob || user.dob;
    user.sex = req.body.sex || user.sex;

    if (req.file) {
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }

      user.avatar = req.file.path;
      user.avatarPublicId = req.file.filename;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        slug: updatedUser.slug,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        location: updatedUser.location,
        dob: updatedUser.dob,
        bio: updatedUser.bio,
        sex: updatedUser.sex,
        provider: updatedUser.provider,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found"})
        }
        res.json({
            id: user.id,
            slug: user.slug,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            location: user.location,
            dob: user.dob,
            bio: user.bio,
            sex: user.sex,
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to fetch profile details", error})
    }
};




export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All password fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.provider === "google" && !user.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in and has no password yet",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await userModel.findById(userId).select(
      "firstName lastName avatar bio phone"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const listings = await Listing.find({ owner: userId }).select("_id");
    const listingIds = listings.map((l) => l._id);

    let averageRating = 0;
    let totalReviews = 0;

    if (listingIds.length > 0) {
      const ratingResult = await Review.aggregate([
        { $match: { listing: { $in: listingIds } } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      if (ratingResult.length > 0) {
        averageRating = ratingResult[0].averageRating || 0;
        totalReviews = ratingResult[0].totalReviews || 0;
      }
    }

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || "",
      bio: user.bio || "",
      phone: user.phone || "",
      averageRating,
      totalReviews,
    });
  } catch (error) {
    console.error("Failed to fetch public profile:", error);
    res.status(500).json({ message: "Failed to fetch public profile" });
  }
};

export const getPublicUserActiveListings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const now = new Date();

    const listings = await Listing.find({
      owner: userId,
      publishStatus: "PUBLISHED",
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    })
      .sort({ createdAt: -1 })
      .select(
        "slug title price location state city images category subcategory listingType createdAt"
      );

    res.json(listings);
  } catch (error) {
    console.error("Failed to fetch public user listings:", error);
    res.status(500).json({ message: "Failed to fetch active listings" });
  }
};

export const getPublicProfileBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const user = await userModel.findOne({ slug }).select(
      "firstName lastName slug avatar bio phone"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const listings = await Listing.find({ owner: user._id }).select("_id");
    const listingIds = listings.map((l) => l._id);

    let averageRating = 0;
    let totalReviews = 0;

    if (listingIds.length > 0) {
      const ratingResult = await Review.aggregate([
        { $match: { listing: { $in: listingIds } } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      if (ratingResult.length > 0) {
        averageRating = ratingResult[0].averageRating || 0;
        totalReviews = ratingResult[0].totalReviews || 0;
      }
    }

    res.json({
      id: user._id,
      slug: user.slug,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || "",
      bio: user.bio || "",
      phone: user.phone || "",
      averageRating,
      totalReviews,
    });
  } catch (error) {
    console.error("Failed to fetch public profile by slug:", error);
    res.status(500).json({ message: "Failed to fetch public profile" });
  }
};
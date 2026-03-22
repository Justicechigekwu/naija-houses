import userModel from "../models/userModel.js";
import Listing from "../models/listingModels.js";
import markExpiredListings from "../utils/markExpiredListings.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const toggleFavorite = async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!isValidObjectId(listingId)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    await markExpiredListings();

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const now = new Date();
    const isExpired =
      listing.publishStatus !== "PUBLISHED" ||
      (listing.expiresAt && listing.expiresAt <= now);

    if (isExpired) {
      await userModel.findByIdAndUpdate(req.user.id, {
        $pull: { favorites: listing._id },
      });

      return res.status(400).json({
        message: "You cannot favorite an expired or unpublished listing",
      });
    }

    const user = await userModel.findById(req.user.id).select("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFavorited = user.favorites.some(
      (favId) => favId.toString() === listingId
    );

    if (alreadyFavorited) {
      user.favorites = user.favorites.filter(
        (favId) => favId.toString() !== listingId
      );
      await user.save();

      return res.json({
        message: "Removed from favorites",
        isFavorited: false,
      });
    }

    user.favorites.push(listing._id);
    await user.save();

    return res.json({
      message: "Added to favorites",
      isFavorited: true,
    });
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return res.status(500).json({
      message: error.message || "Failed to toggle favorite",
    });
  }
};

export const getMyFavorites = async (req, res) => {
  try {
    await markExpiredListings();

    const now = new Date();

    const user = await userModel
      .findById(req.user.id)
      .populate({
        path: "favorites",
        match: {
          publishStatus: "PUBLISHED",
          $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
        },
        populate: {
          path: "owner",
          select: "firstName lastName avatar",
        },
        options: { sort: { createdAt: -1 } },
      })
      .select("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validFavorites = user.favorites.filter(Boolean);

    const validFavoriteIds = validFavorites.map((listing) => listing._id.toString());

    await userModel.findByIdAndUpdate(req.user.id, {
      $set: { favorites: validFavoriteIds },
    });

    return res.json(validFavorites);
  } catch (error) {
    console.error("getMyFavorites error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch favorites",
    });
  }
};

export const checkFavoriteStatus = async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!isValidObjectId(listingId)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const user = await userModel.findById(req.user.id).select("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFavorited = user.favorites.some(
      (favId) => favId.toString() === listingId
    );

    return res.json({ isFavorited });
  } catch (error) {
    console.error("checkFavoriteStatus error:", error);
    return res.status(500).json({
      message: error.message || "Failed to check favorite status",
    });
  }
};
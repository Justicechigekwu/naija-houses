import mongoose from "mongoose";
import Chat from "../models/chatModel.js";
import Review from "../models/reviewModel.js";
import Message from "../models/messageModels.js";
import Listing from "../models/listingModels.js";

export const createReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    const listing = await Listing.findById(listingId);

    if (!listing) 
      return res.status(404).json({ message: "Listing not found"});
    if (listing.owner.toString() === reviewerId) {
      return res.status(403).json({
        message: "You cannot rate your listing",
      });
    }

    const chat = await Chat.findOne({
      listing: listingId,
      participants: { $all: [reviewerId, listing.owner] },
    });

    if (!chat) {
      return res.status(403).json({
        message: "You must chat with the seller before reviewing",
      });
    }

    const hasMessage = await Message.exists({
      chat: chat._id
    });

    if (!hasMessage) {
      return res.status(403).json({
        message: " Send atleast one message before reviewing"
      });
    }

    const existingReview = await Review.findOne({
      listing: listingId,
      reviewer: reviewerId 
    });

    if (existingReview) {
      return res.status(400).json({
        message: " You can not rate twice"
      });
    }

    const review = await Review.create({
      listing: listingId,
      reviewer: reviewerId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating review" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const reviewerId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.reviewer.toString() !== reviewerId)
      return res.status(403).json({ message: "Not authorized" });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating review" });
  }
};

export const getReviews = async (req, res) => {
    try {

        const { listingId } = req.params;

        const reviews = await Review.find({ listing: listingId })
        .populate({
          path: "reviewer",
          select: 'avatar firstName lastName avatar'
        })
        .sort({ createdAt: -1 });

        const safeReviews = reviews.filter(r => r.reviewer);
        res.json(safeReviews);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching reviews" });
    }
};

export const getAverageRating = async (req, res) => {
  try {


    const { listingId } = req.params;
    const result = await Review.aggregate([
      { $match: { listing: new mongoose.Types.ObjectId(listingId) } },
      {
        $group: {
          _id: "$listing",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) return res.json({ averageRating: 0, totalReviews: 0 });

    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching rating" });
  }
};

export const getReviewsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid owner id" });
    }

    const listings = await Listing.find({ owner: ownerId }).select("_id");
    const listingIds = listings.map((l) => l._id);

    const reviews = await Review.find({ listing: { $in: listingIds } })
      .populate("reviewer", "firstName lastName avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching owner reviews" });
  }
};

export const getOwnerAverageRating = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid owner id" });
    }

    const listings = await Listing.find({ owner: ownerId }).select("_id");
    const listingIds = listings.map((l) => l._id);

    const result = await Review.aggregate([
      { $match: { listing: { $in: listingIds } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (!result.length) return res.json({ averageRating: 0, totalReviews: 0 });

    res.json({
      averageRating: result[0].averageRating,
      totalReviews: result[0].totalReviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching owner average rating" });
  }
};
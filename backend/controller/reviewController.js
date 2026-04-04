import mongoose from "mongoose";
import Chat from "../models/chatModel.js";
import Review from "../models/reviewModel.js";
import Message from "../models/messageModels.js";
import Listing from "../models/listingModels.js";
import { createNotification } from "../service/notificationService.js";

const MIN_MESSAGES_PER_SIDE = 2;

const normalizeReviewForClient = (reviewDoc, currentUserId = null) => {
  const review = reviewDoc.toObject ? reviewDoc.toObject() : reviewDoc;

  const helpfulVotes = Array.isArray(review.helpfulVotes) ? review.helpfulVotes : [];

  return {
    ...review,
    helpfulCount: helpfulVotes.length,
    isHelpfulByCurrentUser: currentUserId
      ? helpfulVotes.some((id) => String(id) === String(currentUserId))
      : false,
  };
};

const populateReviewQuery = (query) =>
  query
    .populate("reviewer", "firstName lastName avatar isBanned")
    .populate("seller", "firstName lastName avatar isBanned")
    .populate("listing", "title")
    .populate("sellerReply.user", "firstName lastName avatar isBanned")
    .populate("comments.user", "firstName lastName avatar isBanned");

const getReviewEligibilityData = async ({ listingId, reviewerId }) => {
  const listing = await Listing.findById(listingId).select("owner title");
  if (!listing) {
    return { ok: false, status: 404, message: "Listing not found" };
  }

  if (String(listing.owner) === String(reviewerId)) {
    return { ok: false, status: 403, message: "You cannot rate your own listing" };
  }

  const chat = await Chat.findOne({
    listing: listingId,
    participants: { $all: [reviewerId, listing.owner] },
  });

  if (!chat) {
    return {
      ok: false,
      status: 403,
      message: "You must chat with the seller before reviewing",
    };
  }

  const existingReview = await Review.findOne({
    listing: listingId,
    reviewer: reviewerId,
  }).select("_id rating comment");

  const counts = await Message.aggregate([
    {
      $match: {
        chat: chat._id,
      },
    },
    {
      $group: {
        _id: "$sender",
        count: { $sum: 1 },
      },
    },
  ]);

  const countsMap = new Map(counts.map((item) => [String(item._id), item.count]));

  const buyerMessageCount = countsMap.get(String(reviewerId)) || 0;
  const sellerMessageCount = countsMap.get(String(listing.owner)) || 0;

  const canReview =
    !existingReview &&
    buyerMessageCount >= MIN_MESSAGES_PER_SIDE &&
    sellerMessageCount >= MIN_MESSAGES_PER_SIDE;

  return {
    ok: true,
    listing,
    chat,
    existingReview,
    buyerMessageCount,
    sellerMessageCount,
    canReview,
    minimumRequired: MIN_MESSAGES_PER_SIDE,
  };
};

export const createReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    const data = await getReviewEligibilityData({ listingId, reviewerId });

    if (!data.ok) {
      return res.status(data.status).json({ message: data.message });
    }

    if (data.existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this seller for this listing",
      });
    }

    if (!data.canReview) {
      return res.status(403).json({
        message: `Review is available after both buyer and seller send at least ${data.minimumRequired} messages each`,
      });
    }

    const review = await Review.create({
      listing: listingId,
      seller: data.listing.owner,
      reviewer: reviewerId,
      chat: data.chat._id,
      rating,
      comment: comment?.trim() || "",
    });

    await createNotification({
      userId: data.listing.owner,
      type: "REVIEW_RECEIVED",
      title: "You have a new review",
      message: "A buyer just left you a review.",
      listingId,
      metadata: {
        route: `/feedback/${review._id}`,
        reviewId: review._id.toString(),
        listingId: listingId.toString(),
      },
    });

    const populated = await populateReviewQuery(Review.findById(review._id));

    return res.status(201).json(normalizeReviewForClient(populated, reviewerId));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating review" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const reviewerId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (String(review.reviewer) !== String(reviewerId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (rating) review.rating = rating;
    if (typeof comment === "string") review.comment = comment.trim();

    await review.save();

    const populated = await populateReviewQuery(Review.findById(review._id));
    return res.json(normalizeReviewForClient(populated, reviewerId));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating review" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    const currentUserId = req.user?.id || null;

    const reviews = await populateReviewQuery(
      Review.find({ listing: listingId }).sort({ createdAt: -1 })
    );

    const safeReviews = reviews
      .filter((r) => r.reviewer)
      .map((r) => normalizeReviewForClient(r, currentUserId));

    return res.json(safeReviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching reviews" });
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

    if (result.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }

    return res.json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching rating" });
  }
};

export const getReviewsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const currentUserId = req.user?.id || null;

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid owner id" });
    }

    const reviews = await populateReviewQuery(
      Review.find({ seller: ownerId }).sort({ createdAt: -1 })
    );

    const safeReviews = reviews
      .filter((r) => r.reviewer)
      .map((r) => normalizeReviewForClient(r, currentUserId));

    return res.json(safeReviews);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching owner reviews" });
  }
};

export const getOwnerAverageRating = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid owner id" });
    }

    const result = await Review.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(ownerId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (!result.length) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }

    return res.json({
      averageRating: result[0].averageRating,
      totalReviews: result[0].totalReviews,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching owner average rating" });
  }
};

export const getReviewEligibility = async (req, res) => {
  try {
    const { listingId } = req.params;
    const reviewerId = req.user.id;

    const data = await getReviewEligibilityData({ listingId, reviewerId });

    if (!data.ok) {
      return res.status(data.status).json({ message: data.message });
    }

    return res.json({
      canReview: data.canReview,
      alreadyReviewed: !!data.existingReview,
      existingReview: data.existingReview || null,
      buyerMessageCount: data.buyerMessageCount,
      sellerMessageCount: data.sellerMessageCount,
      minimumRequired: data.minimumRequired,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to check review eligibility" });
  }
};

export const toggleHelpfulVote = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (String(review.reviewer) === String(userId)) {
      return res.status(400).json({
        message: "You cannot vote on your own review",
      });
    }

    const alreadyHelpful = review.helpfulVotes.some(
      (id) => String(id) === String(userId)
    );

    if (alreadyHelpful) {
      review.helpfulVotes = review.helpfulVotes.filter(
        (id) => String(id) !== String(userId)
      );
    } else {
      review.helpfulVotes.push(userId);
    }

    await review.save();

    const populated = await populateReviewQuery(Review.findById(review._id));
    return res.json({
      message: alreadyHelpful ? "Helpful removed" : "Marked as helpful",
      review: normalizeReviewForClient(populated, userId),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update helpful vote" });
  }
};

export const replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const review = await Review.findById(reviewId).populate("listing", "title");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (String(review.seller) !== String(userId)) {
      return res.status(403).json({
        message: "Only the seller who received this review can reply",
      });
    }

    review.sellerReply = {
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await review.save();

    await createNotification({
      userId: review.reviewer,
      type: "REVIEW_REPLY",
      title: "Seller replied to your review",
      message: "A seller has replied to your review.",
      listingId: review.listing?._id || review.listing,
      metadata: {
        route: `/feedback/${review._id}`,
        reviewId: review._id.toString(),
      },
    });

    const populated = await populateReviewQuery(Review.findById(review._id));
    return res.json(normalizeReviewForClient(populated, userId));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to reply to review" });
  }
};

export const addReviewComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.comments.push({
      user: userId,
      text: text.trim(),
    });

    await review.save();

    if (String(review.reviewer) !== String(userId)) {
      await createNotification({
        userId: review.reviewer,
        type: "REVIEW_COMMENT",
        title: "New comment on your review",
        message: "Someone commented on your review.",
        listingId: review.listing,
        metadata: {
          route: `/feedback/${review._id}`,
          reviewId: review._id.toString(),
        },
      });
    }

    const populated = await populateReviewQuery(Review.findById(review._id));
    return res.status(201).json(normalizeReviewForClient(populated, userId));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add comment" });
  }
};

export const deleteReviewComment = async (req, res) => {
  try {
    const { reviewId, commentId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const comment = review.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isCommentOwner = String(comment.user) === String(userId);
    const isSeller = String(review.seller) === String(userId);

    if (!isCommentOwner && !isSeller) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    comment.deleteOne();
    await review.save();

    const populated = await populateReviewQuery(Review.findById(review._id));
    return res.json(normalizeReviewForClient(populated, userId));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete comment" });
  }
};
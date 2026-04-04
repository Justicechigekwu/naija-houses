// import express from "express";
// import verifyToken from "../middleware/authMiddleware.js";
// import {
//   createReview,
//   getAverageRating,
//   getReviews,
//   updateReview,
//   getReviewsByOwner,
//   getOwnerAverageRating,
//   getReviewEligibility,
//   toggleHelpfulVote,
//   replyToReview,
// } from "../controller/reviewController.js";

// const router = express.Router();

// router.get("/eligibility/:listingId", verifyToken, getReviewEligibility);

// router.post("/", verifyToken, createReview);
// router.put("/:reviewId", verifyToken, updateReview);

// router.post("/:reviewId/helpful", verifyToken, toggleHelpfulVote);
// router.post("/:reviewId/reply", verifyToken, replyToReview);

// router.get("/:listingId/average", getAverageRating);
// router.get("/owner/:ownerId", getReviewsByOwner);
// router.get("/owner/:ownerId/average", getOwnerAverageRating);
// router.get("/:listingId", getReviews);

// export default router;









import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  createReview,
  getAverageRating,
  getReviews,
  updateReview,
  getReviewsByOwner,
  getOwnerAverageRating,
  getReviewEligibility,
  toggleHelpfulVote,
  replyToReview,
  addReviewComment,
  deleteReviewComment,
} from "../controller/reviewController.js";

const router = express.Router();

router.get("/eligibility/:listingId", verifyToken, getReviewEligibility);

router.post("/", verifyToken, createReview);
router.put("/:reviewId", verifyToken, updateReview);

router.post("/:reviewId/helpful", verifyToken, toggleHelpfulVote);
router.post("/:reviewId/reply", verifyToken, replyToReview);

router.post("/:reviewId/comments", verifyToken, addReviewComment);
router.delete("/:reviewId/comments/:commentId", verifyToken, deleteReviewComment);

router.get("/owner/:ownerId/average", getOwnerAverageRating);
router.get("/owner/:ownerId", getReviewsByOwner);
router.get("/:listingId/average", getAverageRating);
router.get("/:listingId", getReviews);

export default router;
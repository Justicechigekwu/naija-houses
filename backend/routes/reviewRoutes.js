import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { 
    createReview, 
    getAverageRating, 
    getReviews, 
    updateReview,
    getReviewsByOwner,
    getOwnerAverageRating
 } from '../controller/reviewController.js';

const router = express.Router();

router.post('/', verifyToken, createReview)
router.put('/:reviewId', verifyToken, updateReview)

router.get('/:listingId/average', getAverageRating)
router.get("/owner/:ownerId", getReviewsByOwner);

router.get("/owner/:ownerId/average", getOwnerAverageRating);
router.get('/:listingId', getReviews)

export default router;

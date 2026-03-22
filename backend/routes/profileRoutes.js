import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { changePassword, getProfile, getPublicProfile, getPublicUserActiveListings, updateProfile } from '../controller/profileController.js';
import avatarUploads from '../middleware/avatarMiddleware.js';
import { userListing } from '../controller/userListingController.js';

const router = express.Router();

router.get("/public/:userId", getPublicProfile);
router.get("/public/:userId/listings", getPublicUserActiveListings);

router.get('/', verifyToken, getProfile)
router.get('/:userId', verifyToken, userListing)
router.put("/", verifyToken, avatarUploads.single("avatar"), updateProfile);

router.put('/update', verifyToken, updateProfile)
router.put('/change-password', verifyToken, changePassword);

export default router;
 
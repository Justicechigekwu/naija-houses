import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { getProfile, updateProfile } from '../controller/profileController.js';
import upload from '../middleware/multerMiddleware.js';
import { userListing } from '../controller/userListingController.js';

const router = express.Router();

router.get('/profile', verifyToken, getProfile)
router.get('/profile/:userId', verifyToken, userListing)
router.put('/profile/update', verifyToken, updateProfile)
router.put('/profile', verifyToken, upload.single('avatar'), updateProfile)

export default router;
import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { createListing, deleteListing, getListingById, getLitsing, updateListing } from '../controller/listingController.js';
import upload from '../middleware/multerMiddleware.js';
import relatedListingController from '../controller/relatedListingController.js';
import searchController from '../controller/searchController.js';
import { choosePublishPlan } from '../controller/listingDurationController.js';
import { publishOptions } from '../controller/publishOption.js';
import optionalAuth from '../middleware/optionalAuthMiddleware.js';


const router = express.Router()

router.get('/', getLitsing)
router.get('/search', searchController)

router.get('/:id/related', relatedListingController)
router.get("/:id/publish-options", verifyToken, publishOptions);
router.post("/:id/choose-plan", verifyToken, choosePublishPlan);

router.get('/:id', optionalAuth, getListingById)

router.post('/', verifyToken, upload.array('images', 10), createListing)
router.put('/:id', verifyToken, upload.array('images', 10), updateListing)
router.delete('/:id', verifyToken, deleteListing)

export default router;
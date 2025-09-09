import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { createListing, deleteListing, getListingById, getLitsing, updateListing } from '../controller/listingController.js';
import upload from '../middleware/multerMiddleware.js';
import relatedListingController from '../controller/relatedListingController.js';
import searchController from '../controller/searchController.js';


const router = express.Router()

router.get('/', getLitsing)
router.get('/search', searchController)
router.get('/:id', getListingById)
router.get('/:id/related', relatedListingController)
router.post('/', verifyToken, upload.array('images', 10), createListing)
router.put('/:id', verifyToken, upload.array('images', 10), updateListing)
router.delete('/:id', verifyToken, deleteListing)

export default router;
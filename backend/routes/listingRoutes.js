import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { createListing, deleteListing, getListingById, getLitsing, updateListing } from '../controller/listingController.js';
import upload from '../middleware/multerMiddleware.js';


const router = express.Router()

router.get('/', getLitsing)
router.get('/:id', getListingById)
router.post('/', verifyToken, upload.array('images', 10), createListing)
router.put('/:id', verifyToken, upload.array('images', 10), updateListing)
router.delete('/:id', verifyToken, deleteListing)

export default router;
import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { createListing, deleteListing, getLitsing, updateListing } from '../controller/listingController.js';
import upload from '../middleware/multerMiddleware.js';


const router = express.Router()

router.get('/', getLitsing)
router.post('/create', verifyToken, upload.array('images', 10), createListing)
router.put('/edit/:id', verifyToken, upload.array('images', 10), updateListing)
router.delete('/delete/:id', verifyToken, deleteListing)

export default router;
import express from "express";
import verifyToken from '../middleware/authMiddleware.js';
import { createDrafts, deleteDraft, draftListings } from "../controller/draftController.js";
import { pendingListings } from "../controller/pendingListingsController.js";
import { expiredListings } from "../controller/expiredListingsController.js";

const router = express.Router();

router.get("/me/drafts", verifyToken, draftListings);
router.get("/me/pending", verifyToken, pendingListings);
router.get("/me/expired", verifyToken, expiredListings);

router.post("/drafts/create", verifyToken, createDrafts);
router.delete("/drafts/:id", verifyToken, deleteDraft)

export default router;
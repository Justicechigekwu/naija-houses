import express from "express";
import { createListingReport, createUserReport } from "../controller/reportController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/listings/:listingId", verifyToken, createListingReport);
router.post("/users/:userId", verifyToken, createUserReport);

export default router;
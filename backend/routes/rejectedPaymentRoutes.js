import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { getRejectedPaymentListing } from "../controller/rejectedPaymentController.js";

const router = express.Router();

router.get("/:listingId/rejected-payment", verifyToken, getRejectedPaymentListing);

export default router;
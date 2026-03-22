import express from "express";
import {
  getAppealableListing,
  submitListingAppeal,
} from "../controller/listingAppealController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:listingId/appeal", verifyToken, getAppealableListing);
router.post("/:listingId/appeal", verifyToken, submitListingAppeal);

export default router;
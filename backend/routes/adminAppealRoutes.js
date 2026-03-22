import express from "express";
import {
  getPendingAppeals,
  approveAppeal,
  rejectAppeal,
} from "../controller/adminAppealController.js";
import verifyAdmin from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/appeals", verifyAdmin, getPendingAppeals);
router.patch("/appeals/:listingId/approve", verifyAdmin, approveAppeal);
router.patch("/appeals/:listingId/reject", verifyAdmin, rejectAppeal);

export default router;
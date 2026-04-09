import express from "express";
import optionalAuth from "../middleware/optionalAuthMiddleware.js";
import verifyAdmin from "../middleware/adminAuthMiddleware.js";
import {
  trackAnalyticsEvent,
  getAdminAnalyticsOverview,
} from "../controller/analyticsController.js";

const router = express.Router();

router.post("/track", optionalAuth, trackAnalyticsEvent);
router.get("/admin/overview", verifyAdmin, getAdminAnalyticsOverview);

export default router;
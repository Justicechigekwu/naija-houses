import express from "express";
import { trackAnalyticsEvent, getAdminAnalyticsOverview } from "../controller/analyticsController.js";
import verifyAdmin from "../middleware/adminAuthMiddleware.js";
import optionalAuth from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

router.post("/track", optionalAuth, trackAnalyticsEvent);
router.get("/admin/overview", verifyAdmin, getAdminAnalyticsOverview);

export default router;
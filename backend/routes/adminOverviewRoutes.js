import express from "express";
import verifyAdmin from "../middleware/adminAuthMiddleware.js";
import { getAdminOverview } from "../controller/adminOverviewController.js";

const router = express.Router();

router.get("/overview", verifyAdmin, getAdminOverview);

export default router;
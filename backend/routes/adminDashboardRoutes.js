import express from "express";
import verifyAdmin from "../middleware/adminAuthMiddleware.js";
import { usersWithListing, listingsForUser } from "../controller/adminDashboardController.js";

const router = express.Router();

router.get("/users", verifyAdmin, usersWithListing);
router.get("/users/:userId/listings", verifyAdmin, listingsForUser);

export default router;
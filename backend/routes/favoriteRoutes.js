import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { checkFavoriteStatus, getMyFavorites, toggleFavorite } from "../controller/favoriteController.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getMyFavorites);
router.get("/:listingId/status", checkFavoriteStatus);
router.post("/:listingId/toggle", toggleFavorite);

export default router;
import express from "express";
import {
  getLocationFeed,
  searchListingsByLocation,
} from "../controller/locationListingController.js";

const router = express.Router();

router.get("/feed/location", getLocationFeed);
router.get("/search/location", searchListingsByLocation);

export default router;
// import express from "express";
// import {
//   getAppealableListing,
//   submitListingAppeal,
// } from "../controller/listingAppealController.js";
// import verifyToken from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/:listingId/appeal", verifyToken, getAppealableListing);
// router.post("/:listingId/appeal", verifyToken, submitListingAppeal);

// export default router;


import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  getAppealListing,
  submitAppeal,
} from "../controller/listingAppealController.js";

const router = express.Router();

router.get("/:listingId/appeal", verifyToken, getAppealListing);
router.post("/:listingId/appeal", verifyToken, submitAppeal);


export default router;
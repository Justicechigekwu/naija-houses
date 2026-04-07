import express from "express";
import {
  deleteReport,
  deleteResolvedReports,
  getAllReports,
  updateReportStatus,
} from "../controller/adminReportController.js";
import {
  adminDeleteListing,
  adminDeleteUser,
} from "../controller/adminModerationController.js";
import verifyAdmin from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/reports", verifyAdmin, getAllReports);
router.patch("/reports/:reportId", verifyAdmin, updateReportStatus);
router.delete("/reports/:reportId", verifyAdmin, deleteReport);
router.delete("/reports", verifyAdmin, deleteResolvedReports);

router.delete("/listings/:listingId", verifyAdmin, adminDeleteListing);
router.delete("/users/:userId", verifyAdmin, adminDeleteUser);

export default router;





// original code
// import express from "express";
// import {
//   deleteReport,
//   deleteResolvedReports,
//   getAllReports,
//   updateReportStatus,
// } from "../controller/adminReportController.js";
// import {
//   adminDeleteListing,
//   adminDeleteUser,
// } from "../controller/adminModerationController.js";
// import verifyAdmin from "../middleware/adminAuthMiddleware.js";

// const router = express.Router();

// router.get("/reports", verifyAdmin, getAllReports);
// router.patch("/reports/:reportId", verifyAdmin, updateReportStatus);
// router.delete("/reports/:reportId", verifyAdmin, deleteReport);
// router.delete("/reports", verifyAdmin, deleteResolvedReports);

// router.delete("/listings/:listingId", verifyAdmin, adminDeleteListing);
// router.delete("/users/:userId", verifyAdmin, adminDeleteUser);

// export default router;





// routes/adminModerationRoutes.js

// import express from "express";
// import {
//   deleteReport,
//   deleteResolvedReports,
//   getAllReports,
//   updateReportStatus,
// } from "../controller/adminReportController.js";
// import {
//   adminDeleteListing,
//   adminDeleteUser,
//   rejectPendingListing,
// } from "../controller/adminModerationController.js";
// import verifyAdmin from "../middleware/adminAuthMiddleware.js";

// const router = express.Router();

// router.get("/reports", verifyAdmin, getAllReports);
// router.patch("/reports/:reportId", verifyAdmin, updateReportStatus);
// router.delete("/reports/:reportId", verifyAdmin, deleteReport);
// router.delete("/reports", verifyAdmin, deleteResolvedReports);

// router.patch("/listings/:listingId/reject", verifyAdmin, rejectPendingListing);
// router.delete("/listings/:listingId", verifyAdmin, adminDeleteListing);
// router.delete("/users/:userId", verifyAdmin, adminDeleteUser);

// export default router;
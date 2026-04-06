import express from "express";
import {
  getAdminSupportMessages,
  getAdminSupportMessageDetails,
  updateSupportMessageStatus,
} from "../controller/supportController.js";
import verifyAdmin from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.use(verifyAdmin);

router.get("/", getAdminSupportMessages);
router.get("/:supportId", getAdminSupportMessageDetails);
router.patch("/:supportId", updateSupportMessageStatus);

export default router;
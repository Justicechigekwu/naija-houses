import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controller/notificationController.js";

const router = express.Router();

router.get("/", verifyToken, getMyNotifications);
router.get("/unread-count", verifyToken, getUnreadNotificationCount);
router.patch("/:id/read", verifyToken, markNotificationAsRead);
router.patch("/read-all", verifyToken, markAllNotificationsAsRead);
router.delete("/:id", verifyToken, deleteNotification);

export default router;
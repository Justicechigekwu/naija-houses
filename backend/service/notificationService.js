import Notification from "../models/notificationModel.js";
import {
  emitNotificationToUser,
  emitUnreadNotificationCount,
} from "./realtimeService.js";

export const createNotification = async ({
  userId,
  type,
  title,
  message,
  listingId = null,
  metadata = {},
}) => {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    listing: listingId,
    metadata,
  });

  const populatedNotification = await Notification.findById(notification._id)
    .populate("listing", "title images category subcategory publishStatus");

  const unreadCount = await Notification.countDocuments({
    user: userId,
    isRead: false,
  });

  emitNotificationToUser(userId, populatedNotification);
  emitUnreadNotificationCount(userId, unreadCount);

  return populatedNotification;
};
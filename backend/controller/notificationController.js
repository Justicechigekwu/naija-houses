import Notification from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
import { Expo } from "expo-server-sdk";
import { emitUnreadNotificationCount } from "../service/realtimeService.js";

const expo = new Expo();

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("listing", "title publishStatus");

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load notifications" });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load unread count" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { isRead: true } },
      { new: true }
    ).populate("listing", "title publishStatus");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    emitUnreadNotificationCount(req.user.id, unreadCount);

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update notification" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    emitUnreadNotificationCount(req.user.id, 0);

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to mark all as read" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    emitUnreadNotificationCount(req.user.id, unreadCount);

    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete notification" });
  }
};

export const registerPushToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Valid push token is required" });
    }

    if (!Expo.isExpoPushToken(token)) {
      return res.status(400).json({ message: "Invalid Expo push token" });
    }

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { pushTokens: token },
        $set: {
          pushNotificationsEnabled: true,
          lastPushTokenUpdatedAt: new Date(),
        },
      },
      { new: true }
    ).select("_id pushTokens pushNotificationsEnabled lastPushTokenUpdatedAt");

    res.json({
      message: "Push token registered successfully",
      pushTokens: user?.pushTokens || [],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to register push token",
    });
  }
};

export const unregisterPushToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Valid push token is required" });
    }

    await userModel.findByIdAndUpdate(req.user.id, {
      $pull: { pushTokens: token },
      $set: {
        lastPushTokenUpdatedAt: new Date(),
      },
    });

    res.json({ message: "Push token removed successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to remove push token",
    });
  }
};
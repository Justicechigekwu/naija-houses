"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/libs/notificationApi";
import { useAuth } from "@/context/AuthContext";
import useSocketNotifications from "@/hooks/useSocketNotifications";

export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  listing?: {
    _id: string;
    title?: string;
    publishStatus?: string;
  } | null;
  metadata?: {
    route?: string;
    action?: string;
    [key: string]: string | number | boolean | null | undefined | string[];
  };
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markOneAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);

      const [list, countRes] = await Promise.all([
        fetchNotifications(),
        fetchUnreadNotificationCount(),
      ]);

      setNotifications(Array.isArray(list) ? list : []);
      setUnreadCount(countRes?.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markOneAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsReadFn = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const removeNotificationFn = async (id: string) => {
    try {
      const target = notifications.find((n) => n._id === id);

      await deleteNotification(id);

      setNotifications((prev) => prev.filter((item) => item._id !== id));

      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useSocketNotifications({
    onNewNotification: (notification) => {
      setNotifications((prev) => {
        const exists = prev.some((item) => item._id === notification._id);
        if (exists) return prev;
        return [notification, ...prev];
      });
    },
    onUnreadCount: ({ unreadCount }) => {
      setUnreadCount(unreadCount || 0);
    },
  });

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markOneAsRead,
        markAllAsRead: markAllAsReadFn,
        removeNotification: removeNotificationFn,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
};
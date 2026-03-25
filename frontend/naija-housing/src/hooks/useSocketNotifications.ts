"use client";

import { useEffect } from "react";
import { connectSocket } from "@/libs/socket";
import type { AppNotification } from "@/context/NotificationContext";

type UseSocketNotificationsProps = {
  onNewNotification?: (notification: AppNotification) => void;
  onUnreadCount?: (payload: { unreadCount: number }) => void;
};

export default function useSocketNotifications({
  onNewNotification,
  onUnreadCount,
}: UseSocketNotificationsProps) {
  useEffect(() => {
    const socket = connectSocket();

    const handleNewNotification = (notification: AppNotification) => {
      onNewNotification?.(notification);
    };

    const handleUnreadCount = (payload: { unreadCount: number }) => {
      onUnreadCount?.(payload);
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("notification:unread-count", handleUnreadCount);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:unread-count", handleUnreadCount);
    };
  }, [onNewNotification, onUnreadCount]);
}
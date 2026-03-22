"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import { connectSocket } from "@/libs/socket";

const SOCKET_EVENTS = {
  CHAT_UNREAD_COUNT: "chat:unread-count",
};

export default function useUnreadMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket = connectSocket();

    const fetchInitialUnread = async () => {
      try {
        const res = await api.get("/chats");

        const totalUnread = Array.isArray(res.data)
          ? res.data.reduce(
              (sum: number, chat: any) => sum + (chat.unreadCount || 0),
              0
            )
          : 0;

        setCount(totalUnread);
      } catch (error) {
        console.error("Failed to fetch unread messages", error);
      }
    };

    const handleUnreadCount = (payload: { unreadCount: number }) => {
      setCount(payload?.unreadCount || 0);
    };

    fetchInitialUnread();

    socket.on(SOCKET_EVENTS.CHAT_UNREAD_COUNT, handleUnreadCount);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_UNREAD_COUNT, handleUnreadCount);
    };
  }, []);

  return count;
}
import { useEffect, useState } from "react";
import { connectSocket } from "@/libs/socket";
import { getChats } from "@/features/chats/api";

export default function useUnreadMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket = connectSocket();

    const fetchInitialUnread = async () => {
      try {
        const chats = await getChats();

        const totalUnread = Array.isArray(chats)
          ? chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0)
          : 0;

        setCount(totalUnread);
      } catch {
        setCount(0);
      }
    };

    const handleUnreadCount = (payload: { unreadCount: number }) => {
      setCount(payload?.unreadCount || 0);
    };

    fetchInitialUnread();

    socket.on("chat:unread-count", handleUnreadCount);

    return () => {
      socket.off("chat:unread-count", handleUnreadCount);
    };
  }, []);

  return count;
}
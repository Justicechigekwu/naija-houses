"use client";

import { useEffect } from "react";
import { connectSocket } from "@/libs/socket";

export default function useChatSocket({
  chatId,
  onNewMessage,
  onMessagesSeen,
}: {
  chatId?: string;
  onNewMessage?: (message: any) => void;
  onMessagesSeen?: (payload: any) => void;
}) {
  useEffect(() => {
    if (!chatId) return;

    const socket = connectSocket();

    socket.emit("chat:join", { chatId });

    const handleNewMessage = (message: any) => {
      if (message.chat === chatId || message.chat?._id === chatId) {
        onNewMessage?.(message);
      }
    };

    const handleMessagesSeen = (payload: any) => {
      if (payload.chatId === chatId) {
        onMessagesSeen?.(payload);
      }
    };

    socket.on("chat:new-message", handleNewMessage);
    socket.on("chat:messages-seen", handleMessagesSeen);

    return () => {
      socket.emit("chat:leave", { chatId });
      socket.off("chat:new-message", handleNewMessage);
      socket.off("chat:messages-seen", handleMessagesSeen);
    };
  }, [chatId, onNewMessage, onMessagesSeen]);
}
"use client";

import { useEffect } from "react";
import { connectSocket } from "@/libs/socket";

type ChatRef = string | { _id?: string };

type ChatMessage = {
  chat?: ChatRef;
};

type MessagesSeenPayload = {
  chatId?: string;
};

function getChatId(chat?: ChatRef) {
  if (!chat) return undefined;
  if (typeof chat === "string") return chat;
  return chat._id;
}

export default function useChatSocket({
  chatId,
  onNewMessage,
  onMessagesSeen,
}: {
  chatId?: string;
  onNewMessage?: (message: ChatMessage) => void;
  onMessagesSeen?: (payload: MessagesSeenPayload) => void;
}) {
  useEffect(() => {
    if (!chatId) return;

    const socket = connectSocket();

    socket.emit("chat:join", { chatId });

    const handleNewMessage = (message: ChatMessage) => {
      const incomingChatId = getChatId(message.chat);

      if (incomingChatId === chatId) {
        onNewMessage?.(message);
      }
    };

    const handleMessagesSeen = (payload: MessagesSeenPayload) => {
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
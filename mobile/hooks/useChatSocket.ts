import { useEffect } from "react";
import { connectSocket } from "@/libs/socket";

type ChatRef = string | { _id?: string };

type ChatMessage = {
  chat?: ChatRef;
};

type MessagesSeenPayload = {
  chatId?: string;
  seenBy?: string;
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
  onMessageDeliveredUpdate,
  onChatDeleted,
}: {
  chatId?: string;
  onNewMessage?: (payload: any) => void;
  onMessagesSeen?: (payload: MessagesSeenPayload) => void;
  onMessageDeliveredUpdate?: (payload: {
    chatId: string;
    messageId: string;
    deliveredToUserId: string;
  }) => void;
  onChatDeleted?: (payload: { chatId: string }) => void;
}) {
  useEffect(() => {
    if (!chatId) return;

    const socket = connectSocket();

    socket.emit("chat:join", { chatId });

    const handleNewMessage = (payload: any) => {
      const incomingChatId =
        payload?.chatId || getChatId(payload?.message?.chat || payload?.chat);

      if (incomingChatId === chatId) {
        onNewMessage?.(payload);
      }
    };

    const handleMessagesSeen = (payload: MessagesSeenPayload) => {
      if (payload.chatId === chatId) {
        onMessagesSeen?.(payload);
      }
    };

    const handleDeliveredUpdate = (payload: {
      chatId: string;
      messageId: string;
      deliveredToUserId: string;
    }) => {
      if (payload.chatId === chatId) {
        onMessageDeliveredUpdate?.(payload);
      }
    };

    const handleChatDeleted = (payload: { chatId: string }) => {
      if (payload.chatId === chatId) {
        onChatDeleted?.(payload);
      }
    };

    socket.on("chat:new-message", handleNewMessage);
    socket.on("chat:messages-seen", handleMessagesSeen);
    socket.on("chat:message-delivered-update", handleDeliveredUpdate);
    socket.on("chat:deleted", handleChatDeleted);

    return () => {
      socket.emit("chat:leave", { chatId });
      socket.off("chat:new-message", handleNewMessage);
      socket.off("chat:messages-seen", handleMessagesSeen);
      socket.off("chat:message-delivered-update", handleDeliveredUpdate);
      socket.off("chat:deleted", handleChatDeleted);
    };
  }, [
    chatId,
    onNewMessage,
    onMessagesSeen,
    onMessageDeliveredUpdate,
    onChatDeleted,
  ]);
}
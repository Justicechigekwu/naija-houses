"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/libs/api";
import ChatList from "@/components/chat/ChatList";
import ChatPage from "@/components/chat/ChatPage";
import { useAuth } from "@/context/AuthContext";
import { connectSocket } from "@/libs/socket";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface UserPreview {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isBanned?: boolean;
}

interface ListingPreview {
  _id?: string | null;
  title?: string;
  price?: string;
  images?: { url: string; public_id: string }[];
  owner?: string;
  isClosed?: boolean;
  closedLabel?: string;
}

interface MessagePreview {
  _id: string;
  text: string;
  createdAt: string;
  sender?: UserPreview;
  seenBy?: string[];
  deliveredTo?: string[];
}

export interface Chat {
  _id: string;
  listing?: ListingPreview;
  participants: UserPreview[];
  lastMessage?: MessagePreview;
  unreadCount?: number;
}

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { user, isHydrated } = useAuth();

  const activeChatIdRef = useRef<string | null>(null);
  const processedMessageIdsRef = useRef<Set<string>>(new Set());
  const pendingChatFetchesRef = useRef<Set<string>>(new Set());

  const getErrorDetails = (error: unknown) => {
    if (error instanceof AxiosError) {
      return error.response?.data || error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return error;
  };

  useEffect(() => {
    activeChatIdRef.current = activeChat?._id || null;
  }, [activeChat]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await api.get("/chats");
        const chatList = Array.isArray(res.data) ? (res.data as Chat[]) : [];
        setChats(chatList);
      } catch (err: unknown) {
        console.error("Failed to fetch chats:", getErrorDetails(err));
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [isHydrated, user, router]);

  const fetchAndInsertChat = async (
    chatId: string,
    message?: MessagePreview,
    incrementUnread = false
  ) => {
    if (pendingChatFetchesRef.current.has(chatId)) return;

    pendingChatFetchesRef.current.add(chatId);

    try {
      const res = await api.get(`/chats/${chatId}`);
      const fetchedChat = res.data as Chat;

      setChats((prev) => {
        const existing = prev.find((chat) => chat._id === chatId);

        const mergedChat: Chat = {
          ...fetchedChat,
          lastMessage: message
            ? {
                _id: message._id,
                text: message.text,
                createdAt: message.createdAt,
                sender: message.sender,
                seenBy: message.seenBy || [],
                deliveredTo: message.deliveredTo || [],
              }
            : fetchedChat.lastMessage,
          unreadCount:
            activeChatIdRef.current === chatId
              ? 0
              : incrementUnread
              ? existing?.unreadCount
                ? existing.unreadCount + 1
                : 1
              : existing?.unreadCount || 0,
        };

        const others = prev.filter((chat) => chat._id !== chatId);
        return [mergedChat, ...others];
      });
    } catch (error: unknown) {
      console.error("Failed to fetch missing chat:", getErrorDetails(error));
    } finally {
      pendingChatFetchesRef.current.delete(chatId);
    }
  };

  const upsertChatFromMessage = ({
    chatId,
    message,
    incrementUnread = false,
  }: {
    chatId: string;
    message?: MessagePreview;
    incrementUnread?: boolean;
  }) => {
    if (!message?._id) return;

    setChats((prev) => {
      const existing = prev.find((chat) => chat._id === chatId);

      if (!existing) {
        queueMicrotask(() => {
          fetchAndInsertChat(chatId, message, incrementUnread);
        });
        return prev;
      }

      const isActive = activeChatIdRef.current === chatId;

      const updatedChat: Chat = {
        ...existing,
        lastMessage: {
          _id: message._id,
          text: message.text,
          createdAt: message.createdAt,
          sender: message.sender,
          seenBy: message.seenBy || [],
          deliveredTo: message.deliveredTo || [],
        },
        unreadCount: isActive
          ? 0
          : incrementUnread
          ? (existing.unreadCount || 0) + 1
          : existing.unreadCount || 0,
      };

      const others = prev.filter((chat) => chat._id !== chatId);
      return [updatedChat, ...others];
    });

    setActiveChat((prev) => {
      if (!prev || prev._id !== chatId) return prev;

      return {
        ...prev,
        lastMessage: {
          _id: message._id,
          text: message.text,
          createdAt: message.createdAt,
          sender: message.sender,
          seenBy: message.seenBy || [],
          deliveredTo: message.deliveredTo || [],
        },
        unreadCount: 0,
      };
    });
  };

  useEffect(() => {
    if (!isHydrated || !user) return;

    const socket = connectSocket();

    const handleNewMessage = ({
      chatId,
      message,
    }: {
      chatId: string;
      message: MessagePreview;
    }) => {
      if (!message?._id || !chatId) return;

      if (processedMessageIdsRef.current.has(message._id)) {
        return;
      }

      processedMessageIdsRef.current.add(message._id);

      if (processedMessageIdsRef.current.size > 500) {
        const ids = Array.from(processedMessageIdsRef.current);
        processedMessageIdsRef.current = new Set(ids.slice(-250));
      }

      const isActive = activeChatIdRef.current === chatId;

      upsertChatFromMessage({
        chatId,
        message,
        incrementUnread: !isActive,
      });
    };

    const handleMessagesSeen = ({
      chatId,
      seenBy,
    }: {
      chatId: string;
      seenBy: string;
    }) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat._id !== chatId) return chat;

          return {
            ...chat,
            unreadCount: 0,
            lastMessage: chat.lastMessage
              ? {
                  ...chat.lastMessage,
                  seenBy: (chat.lastMessage.seenBy || []).some(
                    (id) => String(id) === String(seenBy)
                  )
                    ? chat.lastMessage.seenBy
                    : [...(chat.lastMessage.seenBy || []), seenBy],
                }
              : chat.lastMessage,
          };
        })
      );

      setActiveChat((prev) =>
        prev && prev._id === chatId ? { ...prev, unreadCount: 0 } : prev
      );
    };

    const handleChatDeleted = ({ chatId }: { chatId: string }) => {
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      setActiveChat((prev) => (prev?._id === chatId ? null : prev));
    };

    const handleUnreadCount = (_payload: { unreadCount: number }) => {};

    socket.on("chat:new-message", handleNewMessage);
    socket.on("chat:messages-seen", handleMessagesSeen);
    socket.on("chat:deleted", handleChatDeleted);
    socket.on("chat:unread-count", handleUnreadCount);

    return () => {
      socket.off("chat:new-message", handleNewMessage);
      socket.off("chat:messages-seen", handleMessagesSeen);
      socket.off("chat:deleted", handleChatDeleted);
      socket.off("chat:unread-count", handleUnreadCount);
    };
  }, [isHydrated, user]);

  const handleSelectChat = (chat: Chat) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      router.push(`/messages/${chat._id}`);
      return;
    }

    setActiveChat({ ...chat, unreadCount: 0 });

    setChats((prev) =>
      prev.map((item) =>
        item._id === chat._id ? { ...item, unreadCount: 0 } : item
      )
    );
  };

  const handleMarkedSeen = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );

    setActiveChat((prev) =>
      prev && prev._id === chatId ? { ...prev, unreadCount: 0 } : prev
    );
  };

  const handleLocalMessageSent = ({
    chatId,
    message,
  }: {
    chatId: string;
    message: MessagePreview;
  }) => {
    if (!message?._id) return;

    processedMessageIdsRef.current.add(message._id);

    upsertChatFromMessage({
      chatId,
      message,
      incrementUnread: false,
    });
  };

  if (!isHydrated) {
    return (
      <div className="flex h-[80vh] border rounded bg-white mt-8 max-w-6xl mx-auto overflow-hidden">
        <div className="w-full flex items-center justify-center text-gray-500">
          Checking session...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-[80vh] border rounded bg-white mt-8 max-w-6xl mx-auto overflow-hidden">
      <div className="w-full md:w-1/3 border-r overflow-y-auto">
        {loading ? (
          <div className="p-4 text-gray-500">Loading chats...</div>
        ) : (
          <ChatList
            chats={chats}
            activeChatId={activeChat?._id}
            onSelect={handleSelectChat}
            onDeleted={(chatId) => {
              setChats((prev) => prev.filter((chat) => chat._id !== chatId));
              if (activeChat?._id === chatId) setActiveChat(null);
            }}
          />
        )}
      </div>

      <div className="hidden md:flex w-2/3">
        {activeChat ? (
          <ChatPage
            chatId={activeChat._id}
            onMarkedSeen={handleMarkedSeen}
            onLocalMessageSent={handleLocalMessageSent}
          />
        ) : (
          <div className="w-full flex items-center justify-center text-gray-500">
            Select a chat to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
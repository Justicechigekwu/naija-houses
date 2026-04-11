"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import api from "@/libs/api";
import RateSellerPrompt from "./RateSeller";
import Link from "next/link";
import { EllipsisVertical, ArrowLeft } from "lucide-react";
import deleteChat from "@/controllers/deleteChat";
import { useRouter } from "next/navigation";
import { connectSocket } from "@/libs/socket";
import ReportChatTargetModal from "./ReportChatTargetModal";
import { AxiosError } from "axios";

interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isBanned?: boolean;
  };
  text: string;
  createdAt: string;
  deliveredTo?: string[];
  seenBy: string[];
}

interface ChatDetails {
  _id: string;
  listing: {
    _id?: string | null;
    slug?: string;
    title?: string;
    price?: string;
    images?: { url: string; public_id: string }[];
    owner?: string;
    isClosed?: boolean;
    closedLabel?: string;
  };
  participants: {
    _id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isBanned?: boolean;
  }[];
}

function formatBubbleTime(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ChatPage({
  chatId,
  showBackButton = false,
  onMarkedSeen,
  onLocalMessageSent,
}: {
  chatId: string;
  showBackButton?: boolean;
  onMarkedSeen?: (chatId: string) => void;
  onLocalMessageSent?: (payload: {
    chatId: string;
    message: Message;
  }) => void | Promise<void>;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetType, setReportTargetType] = useState<"USER" | "LISTING">("USER");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const markingSeenRef = useRef(false);

  const currentUserId = user?.id ?? user?._id;

  const otherUser = chatDetails?.participants.find((p) => p._id !== currentUserId);

  const otherUserName = otherUser?.isBanned
    ? "Velora User"
    : otherUser
    ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() ||
      "Unknown User"
    : "Unknown User";

  const listingClosed = !!chatDetails?.listing?.isClosed;

  const hasUserId = (arr: Array<string | undefined | null> = [], userId?: string) =>
    arr.some((id) => String(id) === String(userId));

  const isBuyerViewing =
    Boolean(currentUserId) &&
    Boolean(chatDetails?.listing?.owner) &&
    String(currentUserId) !== String(chatDetails?.listing?.owner) &&
    !listingClosed;

  const addMessageIfMissing = (incoming: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === incoming._id);
      if (exists) {
        return prev.map((m) => (m._id === incoming._id ? { ...m, ...incoming } : m));
      }
      return [...prev, incoming];
    });
  };

  const openSellerReport = () => {
    setMenuOpen(false);
    setReportTargetType("USER");
    setReportModalOpen(true);
  };

  const openListingReport = () => {
    setMenuOpen(false);
    setReportTargetType("LISTING");
    setReportModalOpen(true);
  };

  const acknowledgeDelivered = (message: Message) => {
    if (!currentUserId) return;
    if (message.sender?._id === currentUserId) return;

    const socket = connectSocket();
    socket.emit("chat:message-delivered", {
      chatId,
      messageId: message._id,
    });
  };

  const markSeen = async () => {
    if (!chatId || !currentUserId || markingSeenRef.current) return;

    try {
      markingSeenRef.current = true;
      await api.patch(`/chats/${chatId}/seen`);
      onMarkedSeen?.(chatId);

      setMessages((prev) =>
        prev.map((msg) => {
          const isIncoming = msg.sender?._id !== currentUserId;
          const alreadySeen = hasUserId(msg.seenBy || [], currentUserId);
          if (!isIncoming || alreadySeen) return msg;

          return {
            ...msg,
            seenBy: [...(msg.seenBy || []), currentUserId],
          };
        })
      );
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Failed to mark messages as seen",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("Failed to mark messages as seen", error.message);
      } else {
        console.error("Failed to mark messages as seen", error);
      }
    } finally {
      markingSeenRef.current = false;
    }
  };

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    const fetchChatData = async () => {
      try {
        setLoading(true);

        const [chatRes, messagesRes] = await Promise.all([
          api.get(`/chats/${chatId}`),
          api.get(`/chats/${chatId}/messages`),
        ]);

        const fetchedMessages = Array.isArray(messagesRes.data)
          ? (messagesRes.data as Message[])
          : [];

        setChatDetails(chatRes.data as ChatDetails);
        setMessages(fetchedMessages);

        const hasUnreadIncoming = fetchedMessages.some(
          (msg: Message) =>
            msg.sender?._id !== currentUserId &&
            !hasUserId(msg.seenBy || [], currentUserId)
        );

        if (hasUnreadIncoming) {
          await markSeen();
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error("Failed to load chat", error.response?.data || error.message);
        } else if (error instanceof Error) {
          console.error("Failed to load chat", error.message);
        } else {
          console.error("Failed to load chat", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [chatId, currentUserId]);

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    const socket = connectSocket();
    socket.emit("chat:join", { chatId });

    const handleNewMessage = async ({
      chatId: incomingChatId,
      message,
    }: {
      chatId: string;
      message: Message;
    }) => {
      if (incomingChatId !== chatId || !message) return;

      addMessageIfMissing(message);

      const isIncoming = message.sender?._id !== currentUserId;
      if (isIncoming) {
        acknowledgeDelivered(message);
        await markSeen();
      }
    };

    const handleMessagesSeen = ({
      chatId: seenChatId,
      seenBy,
    }: {
      chatId: string;
      seenBy: string;
    }) => {
      if (seenChatId !== chatId) return;
      if (!seenBy) return;

      setMessages((prev) =>
        prev.map((msg) => {
          const isMine = msg.sender?._id === currentUserId;
          if (!isMine) return msg;
          if (hasUserId(msg.seenBy || [], seenBy)) return msg;

          return {
            ...msg,
            seenBy: [...(msg.seenBy || []), seenBy],
          };
        })
      );
    };

    const handleMessageDeliveredUpdate = ({
      chatId: deliveredChatId,
      messageId,
      deliveredToUserId,
    }: {
      chatId: string;
      messageId: string;
      deliveredToUserId: string;
    }) => {
      if (deliveredChatId !== chatId) return;

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id !== messageId) return msg;

          const alreadyDelivered = hasUserId(
            msg.deliveredTo || [],
            deliveredToUserId
          );
          if (alreadyDelivered) return msg;

          return {
            ...msg,
            deliveredTo: [...(msg.deliveredTo || []), deliveredToUserId],
          };
        })
      );
    };

    const handleChatDeleted = ({
      chatId: deletedChatId,
    }: {
      chatId: string;
    }) => {
      if (deletedChatId !== chatId) return;
      router.push("/messages");
    };

    socket.on("chat:new-message", handleNewMessage);
    socket.on("chat:messages-seen", handleMessagesSeen);
    socket.on("chat:message-delivered-update", handleMessageDeliveredUpdate);
    socket.on("chat:deleted", handleChatDeleted);

    return () => {
      socket.emit("chat:leave", { chatId });
      socket.off("chat:new-message", handleNewMessage);
      socket.off("chat:messages-seen", handleMessagesSeen);
      socket.off("chat:message-delivered-update", handleMessageDeliveredUpdate);
      socket.off("chat:deleted", handleChatDeleted);
    };
  }, [chatId, currentUserId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || isSending) return;

    try {
      setIsSending(true);

      const res = await api.post("/chats/message", {
        chatId,
        text,
      });

      const sentMessage = res.data as Message;

      addMessageIfMissing(sentMessage);
      setNewMessage("");

      await onLocalMessageSent?.({
        chatId,
        message: sentMessage,
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Failed to send message", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("Failed to send message", error.message);
      } else {
        console.error("Failed to send message", error);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteChat = async () => {
    try {
      await deleteChat(chatId);
      setMenuOpen(false);
      router.push("/messages");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Failed to delete chat");
      } else {
        alert("Failed to delete chat");
      }
    }
  };

  const getReceiptLabel = (msg: Message) => {
    if (!otherUser?._id) return "";

    const seen = hasUserId(msg.seenBy || [], otherUser._id);
    if (seen) return "Seen";

    const delivered = hasUserId(msg.deliveredTo || [], otherUser._id);
    if (delivered) return "Delivered";

    return "Sent";
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center text-gray-500">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            {showBackButton && (
              <button
                onClick={() => router.push("/messages")}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {otherUser?.avatar && !otherUser?.isBanned ? (
              <img
                src={otherUser.avatar}
                alt={otherUserName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                {otherUserName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="font-semibold truncate">{otherUserName}</p>
              <p className="text-xs text-gray-500 truncate">About this listing</p>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <EllipsisVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                {!otherUser?.isBanned && (
                  <button
                    onClick={openSellerReport}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Report seller
                  </button>
                )}

                {!listingClosed && (
                  <button
                    onClick={openListingReport}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Report listing
                  </button>
                )}

                <button
                  onClick={handleDeleteChat}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                >
                  Delete chat
                </button>
              </div>
            )}
          </div>
        </div>

        {chatDetails?.listing && (
          <>
            {listingClosed ? (
              <div className="flex items-center gap-3 px-4 py-2 border-t bg-gray-50 opacity-80 cursor-not-allowed">
                <div className="w-14 h-14 rounded border bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                  Closed
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate line-through text-gray-500">
                    {chatDetails.listing.title || "Ad closed"}
                  </p>
                  <p className="text-sm text-red-600 font-semibold">Ad closed</p>
                </div>
              </div>
            ) : (
              <Link
                href={`/listings/${chatDetails.listing.slug}`}
                className="flex items-center gap-3 px-4 py-2 border-t hover:bg-gray-50"
              >
                <img
                  src={chatDetails.listing.images?.[0]?.url || "/placeholder.png"}
                  alt={chatDetails.listing.title || "Listing"}
                  className="w-14 h-14 rounded object-cover border"
                />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">
                    {chatDetails.listing.title}
                  </p>
                  <p className="text-sm text-green-600 font-semibold">
                    ₦{Number(chatDetails.listing.price || 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            )}
          </>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-[#EDEDED]">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No messages yet
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender._id === currentUserId;
            const receiptLabel = isMine ? getReceiptLabel(msg) : "";

            return (
              <div
                key={msg._id}
                className={`mb-3 flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%]">
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm ${
                      isMine
                        ? "bg-[#6D9773] text-white rounded-br-md"
                        : "bg-white text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>

                    <div
                      className={`mt-1 flex items-center justify-end gap-2 text-[11px] ${
                        isMine ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      <span>{formatBubbleTime(msg.createdAt)}</span>
                      {isMine && <span>{receiptLabel}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-3">
        {isBuyerViewing && chatDetails?.listing?._id && (
          <div className="mb-3">
            <RateSellerPrompt
              listingId={chatDetails.listing._id}
              chatId={chatId}
              refreshKey={messages.length}
            />
          </div>
        )}

        <div className="flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#6D9773]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            onClick={handleSend}
            disabled={isSending || !newMessage.trim()}
            className={`px-4 py-3 rounded-xl text-white font-medium ${
              isSending || !newMessage.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#6D9773] hover:opacity-90"
            }`}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      <ReportChatTargetModal
        open={reportModalOpen}
        targetType={reportTargetType}
        targetId={
          reportTargetType === "USER"
            ? otherUser && !otherUser.isBanned
              ? otherUser._id
              : undefined
            : !listingClosed
            ? chatDetails?.listing?._id || undefined
            : undefined
        }
        targetLabel={
          reportTargetType === "USER"
            ? otherUserName
            : chatDetails?.listing?.title || "Listing"
        }
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
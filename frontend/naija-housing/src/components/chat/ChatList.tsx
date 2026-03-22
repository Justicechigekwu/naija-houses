"use client";

import { useAuth } from "@/context/AuthContext";
import { formatChatTime } from "@/libs/chatUtils";
import { useEffect, useMemo, useRef, useState } from "react";
import deleteChat from "@/controllers/deleteChat";
import { useUI } from "@/hooks/useUi";

interface Chat {
  _id: string;
  listing?: {
    _id?: string | null;
    title?: string;
    price?: string;
    images?: { url: string; public_id: string }[];
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
  lastMessage?: {
    _id: string;
    text: string;
    createdAt: string;
  };
  unreadCount?: number;
}

export default function ChatList({
  chats,
  activeChatId,
  onSelect,
  onDeleted,
}: {
  chats: Chat[];
  activeChatId?: string;
  onSelect: (chat: Chat) => void;
  onDeleted?: (chatId: string) => void;
}) {
  const { user } = useAuth();
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    chatId: string;
  } | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useUI();

  const colorMap: Record<string, { bg: string; text: string }> = {
    A: { bg: "bg-red-300", text: "text-red-700" },
    B: { bg: "bg-blue-300", text: "text-blue-700" },
    C: { bg: "bg-green-300", text: "text-green-700" },
    D: { bg: "bg-yellow-300", text: "text-yellow-700" },
    E: { bg: "bg-purple-300", text: "text-purple-700" },
    F: { bg: "bg-pink-300", text: "text-pink-700" },
    G: { bg: "bg-indigo-300", text: "text-indigo-700" },
    H: { bg: "bg-orange-300", text: "text-orange-700" },
    I: { bg: "bg-teal-300", text: "text-teal-700" },
    J: { bg: "bg-lime-300", text: "text-lime-700" },
    K: { bg: "bg-cyan-300", text: "text-cyan-700" },
    L: { bg: "bg-emerald-300", text: "text-emerald-700" },
    M: { bg: "bg-fuchsia-300", text: "text-fuchsia-700" },
    N: { bg: "bg-rose-300", text: "text-rose-700" },
    O: { bg: "bg-violet-300", text: "text-violet-700" },
    P: { bg: "bg-sky-300", text: "text-sky-700" },
    Q: { bg: "bg-amber-300", text: "text-amber-700" },
    R: { bg: "bg-stone-300", text: "text-stone-700" },
    S: { bg: "bg-slate-300", text: "text-slate-700" },
    T: { bg: "bg-gray-300", text: "text-gray-700" },
    U: { bg: "bg-neutral-300", text: "text-neutral-700" },
    V: { bg: "bg-zinc-300", text: "text-zinc-700" },
    W: { bg: "bg-yellow-200", text: "text-yellow-800" },
    X: { bg: "bg-orange-200", text: "text-orange-800" },
    Y: { bg: "bg-green-200", text: "text-green-800" },
    Z: { bg: "bg-blue-200", text: "text-blue-800" },
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      setMenu(null);
      onDeleted?.(chatId);
    } catch (error: any) {
      showToast(error.message || "Failed to delete chat");
    }
  };

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aTime = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const bTime = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;

      return bTime - aTime;
    });
  }, [chats]);

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-white">
      <h2 className="p-4 text-xl font-bold border-b">Messages</h2>

      {sortedChats.length === 0 ? (
        <p className="text-gray-500 px-4 py-6">You have no messages yet.</p>
      ) : (
        <ul>
          {sortedChats.map((chat) => {
            const otherUser = chat.participants.find((p) => p._id !== user?.id);

            const displayName = otherUser?.isBanned
              ? "Velora User"
              : otherUser
              ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() ||
                "Unknown User"
              : "Unknown User";

            const firstLetter = displayName.charAt(0).toUpperCase() || "U";

            const colors = colorMap[firstLetter] || {
              bg: "bg-gray-300",
              text: "text-gray-700",
            };

            const unread = chat.unreadCount || 0;
            const listingClosed = !!chat.listing?.isClosed;

            return (
              <li
                key={chat._id}
                onClick={() => onSelect(chat)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setMenu({
                    x: e.clientX,
                    y: e.clientY,
                    chatId: chat._id,
                  });
                }}
                className={`cursor-pointer border-b px-4 py-3 hover:bg-gray-50 transition ${
                  activeChatId === chat._id ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex gap-3">
                  {otherUser?.avatar && !otherUser?.isBanned ? (
                    <img
                      src={otherUser.avatar}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold shrink-0 ${colors.bg} ${colors.text}`}
                    >
                      {firstLetter}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={`text-sm truncate ${
                          unread > 0 ? "font-bold text-gray-900" : "font-semibold"
                        }`}
                      >
                        {displayName}
                      </p>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs whitespace-nowrap ${
                            unread > 0 ? "text-gray-700 font-medium" : "text-gray-500"
                          }`}
                        >
                          {chat.lastMessage?.createdAt
                            ? formatChatTime(chat.lastMessage.createdAt)
                            : ""}
                        </span>

                        {unread > 0 && (
                          <span className="inline-flex min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold items-center justify-center leading-none">
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-800 truncate">
                        {listingClosed ? "Ad closed" : chat.listing?.title || "Listing"}
                      </p>

                      {listingClosed && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                          Closed
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs truncate ${
                        unread > 0 ? "text-gray-700 font-medium" : "text-gray-500"
                      }`}
                    >
                      {chat.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {menu && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white shadow-lg border rounded-lg py-2 w-44"
          style={{ top: menu.y, left: menu.x }}
        >
          <button
            onClick={() => handleDeleteChat(menu.chatId)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
          >
            Delete chat
          </button>
        </div>
      )}
    </div>
  );
}
"use client";
import { useAuth } from "@/context/AuthContext";

interface Chat {
  _id: string;
  listing: { title: string };
  participants: { _id: string; name: string; avatar?: string }[];
  lastMessage?: { text: string };
}

export default function ChatList({
  chats,
  activeChatId,
  onSelect,
}: {
  chats: Chat[];
  activeChatId?: string;
  onSelect: (chat: Chat) => void;
}) {
  const { user } = useAuth();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
  const colorMap: Record<string, {bg: string; text: string}> ={
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
      W: { bg: "bg-yellow-200", text: "text-yellow-800" }, // softer yellow
      X: { bg: "bg-orange-200", text: "text-orange-800" },
      Y: { bg: "bg-green-200", text: "text-green-800" },
      Z: { bg: "bg-blue-200", text: "text-blue-800" }
  }

  return (
    <div className="flex flex-col w-full border-r overflow-y-auto">
      <h2 className="p-4 text-xl font-bold">Messages</h2>

      {chats.length === 0 ? (
        <p className="text-gray-500 px-4">You have no messages yet.</p>
      ) : (
        <ul>
          {chats.map((chat) => {
            const otherUser = chat.participants.find((p) => p._id !== user?.id);
            const displayName = otherUser?.name || "Unknown User";
            const firstLetter = displayName.charAt(0).toUpperCase();
            const colors = colorMap[firstLetter] || { bg: 'bg-gray-300', text: 'text-gray-700'}

            return (
              <li
                key={chat._id}
                onClick={() => onSelect(chat)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100 transition ${
                  activeChatId === chat._id ? "bg-gray-200" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {otherUser?.avatar ? (
                    <img
                      src={`${API_BASE}${otherUser.avatar}`}
                      alt={otherUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colors.bg} ${colors.text}`}>
                      {firstLetter}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{otherUser?.name || "Unknown User"}</p>
                    <p className="font-sm text-sm">
                      {chat.listing?.title || displayName }
                    </p>
                    <p className="text-xs text-gray-600 truncate max-w-[180px]">
                      {chat.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}


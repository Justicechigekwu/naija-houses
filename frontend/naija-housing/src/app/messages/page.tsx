
"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import ChatList from "@/components/ChatList";
import ChatPage from "@/components/ChatPage";

interface Chat {
  _id: string;
  listing: { title: string };
  participants: { _id: string; name: string }[];
  lastMessage?: { text: string };
}

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats");
        console.log("Fetched chats:", res.data);
        setChats(res.data);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };
    fetchChats();
  }, []);

  return (
    <div className="flex h-[75vh] border rounded bg-white mt-8 max-w-6xl mx-auto">
      <div className="w-1/3 border-r  overflow-y-auto">
        <ChatList
          chats={chats}
          activeChatId={activeChat?._id}
          onSelect={(chat) => setActiveChat(chat)}
        />
      </div>

      <div className="w-2/3 flex justify-center ">
        {activeChat ? (
          <ChatPage chatId={activeChat._id} />
        ) : (
          <p className="text-gray-500">Select a chat to start chatting</p>
        )}
      </div>
    </div>
  );

}

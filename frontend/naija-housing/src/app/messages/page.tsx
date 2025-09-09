// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import api from '@/libs/api';
// import { useAuth } from '@/context/AuthContext';

// interface Chat {
//   _id: string;
//   listing: { title: string };
//   participants: { _id: string; name: string }[];
//   lastMessage?: { text: string };
// }

// export default function MessagesPage() {
//   const { user } = useAuth();
//   const [chats, setChats] = useState<Chat[]>([]);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await api.get('/chats');
//         setChats(res.data);
//       } catch (err) {
//         console.error('Failed to fetch chats:', err);
//       }
//     };

//     fetchChats();
//   }, []);

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Messages</h1>

//       {chats.length === 0 ? (
//         <p className="text-gray-500">You have no messages yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {chats.map((chat) => {
//             const otherUsers = chat.participants.filter(p => p._id !== user?.id);
//             const displayName = otherUsers.map(p => p.name).join(', ') || "You";

//             return (
//               <li
//                 key={chat._id}
//                 className="border rounded p-3 hover:shadow transition"
//               >
//                 <Link
//                   href={`/messages/${chat._id}`}
//                   className="block"
//                 >
//                   <p className="font-semibold">{chat.listing?.title || displayName}</p>
//                   <p className="text-sm text-gray-600">
//                     {chat.lastMessage?.text || "No messages yet"}
//                   </p>
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }





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
        console.log("Fetched chats:", res.data); // 👈 debug
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
          <p className="text-gray-500">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );

}

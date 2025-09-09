// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import api from '@/libs/api';
// import { useAuth } from '@/context/AuthContext';

// interface Message {
//   _id: string;
//   sender: { _id: string; name: string };
//   text: string;
//   createdAt: string;
// }

// export default function ChatPage({ chatId }: { chatId: string }) {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const fetchMessages = async () => {
//     try {
//       const res = await api.get(`/chats/${chatId}/messages`);
//       setMessages(res.data);
//     } catch (error) {
//       console.error('Failed to load messages', error);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//     const interval = setInterval(fetchMessages, 4000);
//     return () => clearInterval(interval);
//   }, [chatId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       const res = await api.post('/chats/message', {
//         chatId,
//         text: newMessage,
//       });
//       setMessages((prev) => [...prev, res.data]);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Failed to send message', error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-[80vh] max-w-3xl mx-auto border rounded bg-white">
//       <div className="flex-1 p-4 overflow-y-auto">
//         {messages.map((msg) => (
//           <div
//             key={msg._id}
//             className={`mb-2 flex ${msg.sender._id === user?.id ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`px-3 py-2 rounded-lg max-w-xs ${
//                 msg.sender._id === user?.id
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-black"
//               }`}
//             >
//               <p className="text-sm">{msg.text}</p>
//               <span className="text-xs opacity-70 block">
//                 {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//               </span>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="p-3 border-t flex gap-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message..."
//           className="flex-1 border rounded px-3 py-2"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }




"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import api from "@/libs/api";

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  text: string;
  createdAt: string;
}

export default function ChatPage({ chatId }: { chatId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chats/${chatId}/messages`);
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };
    fetchMessages();

    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await api.post("/chats/message", { chatId, text: newMessage });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto bg-[#EDEDED]">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 flex ${
              msg.sender._id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.sender._id === user?.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70 block">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

import { api } from "@/libs/api";

export type UserPreview = {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isBanned?: boolean;
};

export type ListingPreview = {
  _id?: string | null;
  slug?: string;
  title?: string;
  price?: string;
  images?: { url: string; public_id?: string }[];
  owner?: string;
  isClosed?: boolean;
  closedLabel?: string;
};

export type Message = {
  _id: string;
  sender: UserPreview;
  text: string;
  createdAt: string;
  deliveredTo?: string[];
  seenBy: string[];
};

export type Chat = {
  _id: string;
  listing?: ListingPreview;
  participants: UserPreview[];
  lastMessage?: {
    _id: string;
    text: string;
    createdAt: string;
    sender?: UserPreview;
    seenBy?: string[];
    deliveredTo?: string[];
  };
  unreadCount?: number;
};

export async function startChat(payload: {
  listingId: string;
  ownerId: string;
}) {
  const response = await api.post<Chat>("/chats/start", payload);
  return response.data;
}

export async function sendChatMessage(payload: {
  chatId: string;
  text: string;
}) {
  const response = await api.post<Message>("/chats/message", payload);
  return response.data;
}

export async function getChats() {
  const response = await api.get<Chat[]>("/chats");
  return response.data;
}

export async function getChatById(chatId: string) {
  const response = await api.get<Chat>(`/chats/${chatId}`);
  return response.data;
}

export async function getChatMessages(chatId: string) {
  const response = await api.get<Message[]>(`/chats/${chatId}/messages`);
  return response.data;
}

export async function markChatAsSeen(chatId: string) {
  const response = await api.patch(`/chats/${chatId}/seen`);
  return response.data;
}

export async function deleteChat(chatId: string) {
  const response = await api.delete(`/chats/${chatId}`);
  return response.data;
}
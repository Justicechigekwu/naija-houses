import { useLocalSearchParams } from "expo-router";
import ChatPage from "@/components/chats/ChatPage";

export default function SingleChatScreen() {
  const params = useLocalSearchParams<{ chatId?: string | string[] }>();

  const chatId = Array.isArray(params.chatId)
    ? params.chatId[0]
    : params.chatId || "";

  return <ChatPage chatId={chatId} showBackButton />;
}
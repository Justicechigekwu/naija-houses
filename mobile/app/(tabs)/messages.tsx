import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";

import ChatList from "@/components/chats/ChatList";
import AppScreen from "@/components/ui/AppScreen";
import { useAuthStore } from "@/store/auth-store";
import { connectSocket } from "@/libs/socket";
import { getChats, type Chat } from "@/features/chats/api";
import { useTheme } from "@/hooks/useTheme";

export default function MessagesScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { colors } = useTheme();

  const processedMessageIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      router.replace("/login" as any);
      return;
    }

    const fetchAllChats = async () => {
      try {
        const chatList = await getChats();
        setChats(Array.isArray(chatList) ? chatList : []);
      } catch {
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllChats();
  }, [router, user]);

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket();

    const handleNewMessage = ({
      chatId,
      message,
    }: {
      chatId: string;
      message: any;
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

      setChats((prev) => {
        const existing = prev.find((chat) => chat._id === chatId);
        if (!existing) return prev;

        const updated: Chat = {
          ...existing,
          lastMessage: {
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            sender: message.sender,
            seenBy: message.seenBy || [],
            deliveredTo: message.deliveredTo || [],
          },
          unreadCount:
            message.sender?._id !== user.id
              ? (existing.unreadCount || 0) + 1
              : existing.unreadCount || 0,
        };

        const others = prev.filter((chat) => chat._id !== chatId);
        return [updated, ...others];
      });
    };

    const handleChatDeleted = ({ chatId }: { chatId: string }) => {
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
    };

    socket.on("chat:new-message", handleNewMessage);
    socket.on("chat:deleted", handleChatDeleted);

    return () => {
      socket.off("chat:new-message", handleNewMessage);
      socket.off("chat:deleted", handleChatDeleted);
    };
  }, [user, router]);

  if (loading) {
    return (
      <AppScreen padded={false}>
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: colors.background }}
        >
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false}>
      <View className="flex-1" style={{ backgroundColor: colors.surface }}>
        <View
          className="border-b px-4 py-4"
          style={{ borderColor: colors.border }}
        >
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Messages
          </Text>
        </View>

        <ChatList
          chats={chats}
          onSelect={(chat) => {
            router.push({
              pathname: "/messages/[chatId]",
              params: { chatId: chat._id },
            } as any);
          }}
          onDeleted={(chatId) => {
            setChats((prev) => prev.filter((chat) => chat._id !== chatId));
          }}
        />
      </View>
    </AppScreen>
  );
}
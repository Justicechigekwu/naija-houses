import { useMemo, useRef } from "react";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { useAuthStore } from "@/store/auth-store";
import { deleteChat, type Chat } from "@/features/chats/api";
import { useUI } from "@/hooks/useUI";
import { useTheme } from "@/hooks/useTheme";
import { formatChatTime } from "@/libs/chatUtils";

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
  const user = useAuthStore((state) => state.user);
  const { showToast, showConfirm } = useUI();
  const { colors, resolvedTheme } = useTheme();

  const openSwipeRef = useRef<Swipeable | null>(null);

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

  const handleDeleteChat = async (chatId: string) => {
    showConfirm(
      {
        title: "Delete chat",
        message: "Delete this chat permanently?",
        confirmText: "Delete",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      async () => {
        try {
          await deleteChat(chatId);
          onDeleted?.(chatId);
          showToast("Chat deleted", "success");
        } catch (error: any) {
          showToast(
            error?.response?.data?.message || "Failed to delete chat",
            "error"
          );
        }
      }
    );
  };

  const renderRightActions = (chatId: string) => (
    <Pressable
      onPress={() => handleDeleteChat(chatId)}
      className="items-center justify-center px-6"
      style={{
        backgroundColor: colors.danger,
        minWidth: 90,
      }}
    >
      <Text className="text-sm font-semibold text-white">Delete</Text>
    </Pressable>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.surface }}>
      {sortedChats.length === 0 ? (
        <Text className="px-4 py-6" style={{ color: colors.muted }}>
          You have no messages yet.
        </Text>
      ) : (
        <View>
          {sortedChats.map((chat) => {
            const otherUser = chat.participants.find((p) => p._id !== user?.id);

            const displayName = otherUser?.isBanned
              ? "Velora User"
              : otherUser
              ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() ||
                "Unknown User"
              : "Unknown User";

            const active = activeChatId === chat._id;
            const listingTitle = chat.listing?.title || "Ad closed";
            const unreadCount = chat.unreadCount || 0;

            let rowRef: Swipeable | null = null;

            return (
              <Swipeable
                key={chat._id}
                ref={(ref) => {
                  rowRef = ref;
                }}
                renderRightActions={() => renderRightActions(chat._id)}
                overshootRight={false}
                friction={2}
                rightThreshold={40}
                onSwipeableWillOpen={() => {
                  if (
                    openSwipeRef.current &&
                    openSwipeRef.current !== rowRef
                  ) {
                    openSwipeRef.current.close();
                  }
                  openSwipeRef.current = rowRef;
                }}
                onSwipeableClose={() => {
                  if (openSwipeRef.current === rowRef) {
                    openSwipeRef.current = null;
                  }
                }}
              >
                <Pressable
                  onPress={() => onSelect(chat)}
                  className="border-b px-4 py-4"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: active
                      ? resolvedTheme === "dark"
                        ? colors.background
                        : "#F9F7F5"
                      : colors.surface,
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <Image
                      source={{
                        uri:
                          otherUser?.avatar ||
                          "https://via.placeholder.com/100x100?text=U",
                      }}
                      style={{ width: 52, height: 52, borderRadius: 26 }}
                      contentFit="cover"
                    />

                    <View className="min-w-0 flex-1">
                      <View className="flex-row items-start justify-between">
                        <Text
                          className="flex-1 pr-3 text-base font-semibold"
                          style={{ color: colors.text }}
                          numberOfLines={1}
                        >
                          {displayName}
                        </Text>

                        <Text
                          className="text-xs"
                          style={{
                            color: unreadCount > 0 ? colors.brand : colors.muted,
                          }}
                        >
                          {formatChatTime(chat.lastMessage?.createdAt)}
                        </Text>
                      </View>

                      <Text
                        className="mt-1 text-xs"
                        style={{ color: colors.brand }}
                        numberOfLines={1}
                      >
                        {listingTitle}
                      </Text>

                      <View className="mt-1 flex-row items-center justify-between gap-3">
                        <Text
                          className="flex-1 text-sm"
                          style={{ color: colors.muted }}
                          numberOfLines={1}
                        >
                          {chat.lastMessage?.text || "No messages yet"}
                        </Text>

                        {unreadCount > 0 ? (
                          <View
                            className="items-center justify-center rounded-full"
                            style={{
                              minWidth: 22,
                              height: 22,
                              paddingHorizontal: 6,
                              backgroundColor: colors.brand,
                            }}
                          >
                            <Text className="text-[11px] font-semibold text-white">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </Pressable>
              </Swipeable>
            );
          })}
        </View>
      )}
    </View>
  );
}
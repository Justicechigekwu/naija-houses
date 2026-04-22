import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft, MoreVertical } from "lucide-react-native";
import { AxiosError } from "axios";

import { useAuthStore } from "@/store/auth-store";
import { api } from "@/libs/api";
import { connectSocket } from "@/libs/socket";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import ReportChatTargetModal from "@/components/chats/ReportChatTargetModal";
import { deleteChat } from "@/features/chats/api";
import RateSellerPrompt from "@/components/reviews/RateSellerPrompt";

type Message = {
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
};

type ChatDetails = {
  _id: string;
  listing: {
    _id?: string | null;
    slug?: string;
    title?: string;
    price?: string;
    images?: { url: string; public_id?: string }[];
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
};

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
}: {
  chatId: string;
  showBackButton?: boolean;
}) {
  const router = useRouter();
  const { colors, resolvedTheme } = useTheme();
  const { showToast } = useUI();
  const user = useAuthStore((state) => state.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetType, setReportTargetType] = useState<"USER" | "LISTING">("USER");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewPromptRefreshKey, setReviewPromptRefreshKey] = useState(0);

  const scrollRef = useRef<ScrollView | null>(null);
  const markingSeenRef = useRef(false);

  const currentUserId = user?.id;
  const otherUser = chatDetails?.participants.find((p) => p._id !== currentUserId);

  const otherUserName = otherUser?.isBanned
    ? "Velora User"
    : otherUser
    ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() || "Unknown User"
    : "Unknown User";

  const listingClosed = !!chatDetails?.listing?.isClosed;

  const hasUserId = (arr: Array<string | undefined | null> = [], userId?: string) =>
    arr.some((id) => String(id) === String(userId));

  const isBuyerViewing =
    Boolean(currentUserId) &&
    Boolean(chatDetails?.listing?.owner) &&
    String(currentUserId) !== String(chatDetails?.listing?.owner) &&
    !listingClosed;

  const refreshReviewPrompt = useCallback(() => {
    setReviewPromptRefreshKey((prev) => prev + 1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshReviewPrompt();
    }, [refreshReviewPrompt])
  );

  const addMessageIfMissing = (incoming: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === incoming._id);
      if (exists) {
        return prev.map((m) => (m._id === incoming._id ? { ...m, ...incoming } : m));
      }
      return [...prev, incoming];
    });
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
    } catch {
      //
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
          (msg) =>
            msg.sender?._id !== currentUserId &&
            !hasUserId(msg.seenBy || [], currentUserId)
        );

        if (hasUnreadIncoming) {
          await markSeen();
        }

        refreshReviewPrompt();
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          showToast(error.response?.data?.message || "Failed to load chat", "error");
        } else {
          showToast("Failed to load chat", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [chatId, currentUserId, refreshReviewPrompt, showToast]);

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    const socket = connectSocket();
    socket.emit("chat:join", { chatId });

    const handleNewMessage = ({
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
        markSeen();
      }

      refreshReviewPrompt();
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

          const alreadyDelivered = hasUserId(msg.deliveredTo || [], deliveredToUserId);
          if (alreadyDelivered) return msg;

          return {
            ...msg,
            deliveredTo: [...(msg.deliveredTo || []), deliveredToUserId],
          };
        })
      );
    };

    const handleChatDeleted = ({ chatId: deletedChatId }: { chatId: string }) => {
      if (deletedChatId !== chatId) return;
      router.push("/messages" as any);
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
  }, [chatId, currentUserId, refreshReviewPrompt, router]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
      refreshReviewPrompt();

      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        showToast(error.response?.data?.message || "Failed to send message", "error");
      } else {
        showToast("Failed to send message", "error");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteChat = async () => {
    try {
      await deleteChat(chatId);
      setMenuOpen(false);
      router.push("/messages" as any);
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Failed to delete chat", "error");
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1" style={{ backgroundColor: colors.surface }}>
            <View
              className="border-b"
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <View className="flex-row items-center justify-between px-4 py-3">
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  {showBackButton ? (
                    <Pressable
                      onPress={() => router.push("/messages" as any)}
                      className="rounded-full p-2"
                    >
                      <ArrowLeft size={20} color={colors.text} />
                    </Pressable>
                  ) : null}

                  {otherUser?.avatar && !otherUser?.isBanned ? (
                    <Image
                      source={{ uri: otherUser.avatar }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      className="items-center justify-center rounded-full"
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: colors.border,
                      }}
                    >
                      <Text style={{ color: colors.text, fontWeight: "600" }}>
                        {otherUserName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View className="min-w-0 flex-1">
                    <Text
                      numberOfLines={1}
                      className="font-semibold"
                      style={{ color: colors.text }}
                    >
                      {otherUserName}
                    </Text>
                    <Text numberOfLines={1} className="text-xs" style={{ color: colors.muted }}>
                      About this listing
                    </Text>
                  </View>
                </View>

                <View>
                  <Pressable
                    onPress={() => setMenuOpen(true)}
                    className="rounded-full p-2"
                  >
                    <MoreVertical size={20} color={colors.text} />
                  </Pressable>

                  <Modal
                    transparent
                    visible={menuOpen}
                    animationType="fade"
                    onRequestClose={() => setMenuOpen(false)}
                  >
                    <Pressable
                      className="flex-1 bg-black/30"
                      onPress={() => setMenuOpen(false)}
                    >
                      <View
                        className="absolute right-4 top-24 w-48 rounded-2xl p-2"
                        style={{ backgroundColor: colors.surface }}
                      >
                        {!otherUser?.isBanned ? (
                          <Pressable
                            onPress={() => {
                              setMenuOpen(false);
                              setReportTargetType("USER");
                              setReportModalOpen(true);
                            }}
                            className="rounded-xl px-4 py-3"
                          >
                            <Text style={{ color: colors.text }}>Report seller</Text>
                          </Pressable>
                        ) : null}

                        {!listingClosed ? (
                          <Pressable
                            onPress={() => {
                              setMenuOpen(false);
                              setReportTargetType("LISTING");
                              setReportModalOpen(true);
                            }}
                            className="rounded-xl px-4 py-3"
                          >
                            <Text style={{ color: colors.text }}>Report listing</Text>
                          </Pressable>
                        ) : null}

                        <Pressable
                          onPress={handleDeleteChat}
                          className="rounded-xl px-4 py-3"
                        >
                          <Text style={{ color: colors.danger }}>Delete chat</Text>
                        </Pressable>
                      </View>
                    </Pressable>
                  </Modal>
                </View>
              </View>

              {chatDetails?.listing ? (
                listingClosed ? (
                  <View
                    className="flex-row items-center gap-3 border-t px-4 py-2"
                    style={{ borderColor: colors.border, backgroundColor: colors.background }}
                  >
                    <View
                      className="items-center justify-center rounded border"
                      style={{
                        width: 56,
                        height: 56,
                        borderColor: colors.border,
                        backgroundColor: colors.border,
                      }}
                    >
                      <Text className="text-xs" style={{ color: colors.muted }}>
                        Closed
                      </Text>
                    </View>

                    <View className="min-w-0 flex-1">
                      <Text
                        numberOfLines={1}
                        className="text-sm font-medium"
                        style={{ color: colors.muted, textDecorationLine: "line-through" }}
                      >
                        {chatDetails.listing.title || "Ad closed"}
                      </Text>
                      <Text className="text-sm font-semibold" style={{ color: colors.danger }}>
                        Ad closed
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/listings/[slug]",
                        params: { slug: chatDetails.listing.slug },
                      } as any)
                    }
                    className="flex-row items-center gap-3 border-t px-4 py-2"
                    style={{ borderColor: colors.border }}
                  >
                    <Image
                      source={{
                        uri:
                          chatDetails.listing.images?.[0]?.url ||
                          "https://via.placeholder.com/100x100",
                      }}
                      style={{ width: 56, height: 56, borderRadius: 10 }}
                      contentFit="cover"
                    />
                    <View className="min-w-0 flex-1">
                      <Text
                        numberOfLines={1}
                        className="text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        {chatDetails.listing.title}
                      </Text>
                      <Text className="text-sm font-semibold" style={{ color: colors.success }}>
                        ₦{Number(chatDetails.listing.price || 0).toLocaleString()}
                      </Text>
                    </View>
                  </Pressable>
                )
              ) : null}
            </View>

            <ScrollView
              ref={scrollRef}
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
              style={{
                backgroundColor: resolvedTheme === "dark" ? colors.background : "#EDEDED",
              }}
              onContentSizeChange={() => {
                scrollRef.current?.scrollToEnd({ animated: true });
              }}
            >
              {messages.length === 0 ? (
                <View className="flex-1 items-center justify-center py-10">
                  <Text style={{ color: colors.muted }}>No messages yet</Text>
                </View>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender._id === currentUserId;
                  const receiptLabel = isMine ? getReceiptLabel(msg) : "";

                  return (
                    <View
                      key={msg._id}
                      className={`mb-3 flex ${isMine ? "items-end" : "items-start"}`}
                    >
                      <View
                        className="max-w-[75%] rounded-2xl px-4 py-2"
                        style={{
                          backgroundColor: isMine ? colors.brand : colors.surface,
                          borderBottomRightRadius: isMine ? 8 : 16,
                          borderBottomLeftRadius: isMine ? 16 : 8,
                        }}
                      >
                        <Text
                          className="text-sm"
                          style={{ color: isMine ? "#FFFFFF" : colors.text }}
                        >
                          {msg.text}
                        </Text>

                        <View className="mt-1 flex-row items-center justify-end gap-2">
                          <Text
                            className="text-[11px]"
                            style={{ color: isMine ? "rgba(255,255,255,0.8)" : colors.muted }}
                          >
                            {formatBubbleTime(msg.createdAt)}
                          </Text>
                          {isMine ? (
                            <Text
                              className="text-[11px]"
                              style={{ color: "rgba(255,255,255,0.8)" }}
                            >
                              {receiptLabel}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            <View
              className="border-t p-3"
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              {isBuyerViewing && chatDetails?.listing?._id ? (
                <RateSellerPrompt
                  listingId={chatDetails.listing._id}
                  chatId={chatId}
                  refreshKey={reviewPromptRefreshKey}
                />
              ) : null}

              <View className="flex-row items-end gap-2">
                <TextInput
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Type a message..."
                  placeholderTextColor={colors.muted}
                  multiline
                  textAlignVertical="top"
                  onFocus={() => {
                    requestAnimationFrame(() => {
                      scrollRef.current?.scrollToEnd({ animated: true });
                    });
                  }}
                  className="flex-1 rounded-xl border px-4 py-3"
                  style={{
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.surface,
                    maxHeight: 120,
                  }}
                />

                <Pressable
                  onPress={handleSend}
                  disabled={isSending || !newMessage.trim()}
                  className="rounded-xl px-4 py-3"
                  style={{
                    backgroundColor:
                      isSending || !newMessage.trim() ? colors.border : colors.brand,
                  }}
                >
                  <Text className="font-medium text-white">
                    {isSending ? "Sending..." : "Send"}
                  </Text>
                </Pressable>
              </View>
            </View>

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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
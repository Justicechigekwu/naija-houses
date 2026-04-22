// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Keyboard,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   Pressable,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Image } from "expo-image";
// import { useRouter, useFocusEffect } from "expo-router";
// import { ArrowLeft, MoreVertical } from "lucide-react-native";
// import { AxiosError } from "axios";

// import { useAuthStore } from "@/store/auth-store";
// import { api } from "@/libs/api";
// import { connectSocket } from "@/libs/socket";
// import { useTheme } from "@/hooks/useTheme";
// import { useUI } from "@/hooks/useUI";
// import ReportChatTargetModal from "@/components/chats/ReportChatTargetModal";
// import { deleteChat } from "@/features/chats/api";
// import RateSellerPrompt from "@/components/reviews/RateSellerPrompt";

// type Message = {
//   _id: string;
//   sender: {
//     _id: string;
//     firstName?: string;
//     lastName?: string;
//     avatar?: string;
//     isBanned?: boolean;
//   };
//   text: string;
//   createdAt: string;
//   deliveredTo?: string[];
//   seenBy: string[];
// };

// type ChatDetails = {
//   _id: string;
//   listing: {
//     _id?: string | null;
//     slug?: string;
//     title?: string;
//     price?: string;
//     images?: { url: string; public_id?: string }[];
//     owner?: string;
//     isClosed?: boolean;
//     closedLabel?: string;
//   };
//   participants: {
//     _id: string;
//     firstName?: string;
//     lastName?: string;
//     avatar?: string;
//     isBanned?: boolean;
//   }[];
// };

// function formatBubbleTime(date?: string) {
//   if (!date) return "";
//   return new Date(date).toLocaleTimeString([], {
//     hour: "numeric",
//     minute: "2-digit",
//   });
// }

// export default function ChatPage({
//   chatId,
//   showBackButton = false,
// }: {
//   chatId: string;
//   showBackButton?: boolean;
// }) {
//   const router = useRouter();
//   const { colors, resolvedTheme } = useTheme();
//   const { showToast } = useUI();
//   const user = useAuthStore((state) => state.user);

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [reportModalOpen, setReportModalOpen] = useState(false);
//   const [reportTargetType, setReportTargetType] = useState<"USER" | "LISTING">("USER");
//   const [isSending, setIsSending] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [reviewPromptRefreshKey, setReviewPromptRefreshKey] = useState(0);

//   const scrollRef = useRef<ScrollView | null>(null);
//   const markingSeenRef = useRef(false);

//   const currentUserId = user?.id;
//   const otherUser = chatDetails?.participants.find((p) => p._id !== currentUserId);

//   const otherUserName = otherUser?.isBanned
//     ? "Velora User"
//     : otherUser
//     ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() || "Unknown User"
//     : "Unknown User";

//   const listingClosed = !!chatDetails?.listing?.isClosed;

//   const hasUserId = (arr: Array<string | undefined | null> = [], userId?: string) =>
//     arr.some((id) => String(id) === String(userId));

//   const isBuyerViewing =
//     Boolean(currentUserId) &&
//     Boolean(chatDetails?.listing?.owner) &&
//     String(currentUserId) !== String(chatDetails?.listing?.owner) &&
//     !listingClosed;

//   const refreshReviewPrompt = useCallback(() => {
//     setReviewPromptRefreshKey((prev) => prev + 1);
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       refreshReviewPrompt();
//     }, [refreshReviewPrompt])
//   );

//   const addMessageIfMissing = (incoming: Message) => {
//     setMessages((prev) => {
//       const exists = prev.some((m) => m._id === incoming._id);
//       if (exists) {
//         return prev.map((m) => (m._id === incoming._id ? { ...m, ...incoming } : m));
//       }
//       return [...prev, incoming];
//     });
//   };

//   const acknowledgeDelivered = (message: Message) => {
//     if (!currentUserId) return;
//     if (message.sender?._id === currentUserId) return;

//     const socket = connectSocket();
//     socket.emit("chat:message-delivered", {
//       chatId,
//       messageId: message._id,
//     });
//   };

//   const markSeen = async () => {
//     if (!chatId || !currentUserId || markingSeenRef.current) return;

//     try {
//       markingSeenRef.current = true;
//       await api.patch(`/chats/${chatId}/seen`);

//       setMessages((prev) =>
//         prev.map((msg) => {
//           const isIncoming = msg.sender?._id !== currentUserId;
//           const alreadySeen = hasUserId(msg.seenBy || [], currentUserId);
//           if (!isIncoming || alreadySeen) return msg;

//           return {
//             ...msg,
//             seenBy: [...(msg.seenBy || []), currentUserId],
//           };
//         })
//       );
//     } catch {
//       //
//     } finally {
//       markingSeenRef.current = false;
//     }
//   };

//   useEffect(() => {
//     if (!chatId || !currentUserId) return;

//     const fetchChatData = async () => {
//       try {
//         setLoading(true);

//         const [chatRes, messagesRes] = await Promise.all([
//           api.get(`/chats/${chatId}`),
//           api.get(`/chats/${chatId}/messages`),
//         ]);

//         const fetchedMessages = Array.isArray(messagesRes.data)
//           ? (messagesRes.data as Message[])
//           : [];

//         setChatDetails(chatRes.data as ChatDetails);
//         setMessages(fetchedMessages);

//         const hasUnreadIncoming = fetchedMessages.some(
//           (msg) =>
//             msg.sender?._id !== currentUserId &&
//             !hasUserId(msg.seenBy || [], currentUserId)
//         );

//         if (hasUnreadIncoming) {
//           await markSeen();
//         }

//         refreshReviewPrompt();
//       } catch (error: unknown) {
//         if (error instanceof AxiosError) {
//           showToast(error.response?.data?.message || "Failed to load chat", "error");
//         } else {
//           showToast("Failed to load chat", "error");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChatData();
//   }, [chatId, currentUserId, refreshReviewPrompt, showToast]);

//   useEffect(() => {
//     if (!chatId || !currentUserId) return;

//     const socket = connectSocket();
//     socket.emit("chat:join", { chatId });

//     const handleNewMessage = ({
//       chatId: incomingChatId,
//       message,
//     }: {
//       chatId: string;
//       message: Message;
//     }) => {
//       if (incomingChatId !== chatId || !message) return;

//       addMessageIfMissing(message);

//       const isIncoming = message.sender?._id !== currentUserId;
//       if (isIncoming) {
//         acknowledgeDelivered(message);
//         markSeen();
//       }

//       refreshReviewPrompt();
//     };

//     const handleMessagesSeen = ({
//       chatId: seenChatId,
//       seenBy,
//     }: {
//       chatId: string;
//       seenBy: string;
//     }) => {
//       if (seenChatId !== chatId) return;
//       if (!seenBy) return;

//       setMessages((prev) =>
//         prev.map((msg) => {
//           const isMine = msg.sender?._id === currentUserId;
//           if (!isMine) return msg;
//           if (hasUserId(msg.seenBy || [], seenBy)) return msg;

//           return {
//             ...msg,
//             seenBy: [...(msg.seenBy || []), seenBy],
//           };
//         })
//       );
//     };

//     const handleMessageDeliveredUpdate = ({
//       chatId: deliveredChatId,
//       messageId,
//       deliveredToUserId,
//     }: {
//       chatId: string;
//       messageId: string;
//       deliveredToUserId: string;
//     }) => {
//       if (deliveredChatId !== chatId) return;

//       setMessages((prev) =>
//         prev.map((msg) => {
//           if (msg._id !== messageId) return msg;

//           const alreadyDelivered = hasUserId(msg.deliveredTo || [], deliveredToUserId);
//           if (alreadyDelivered) return msg;

//           return {
//             ...msg,
//             deliveredTo: [...(msg.deliveredTo || []), deliveredToUserId],
//           };
//         })
//       );
//     };

//     const handleChatDeleted = ({ chatId: deletedChatId }: { chatId: string }) => {
//       if (deletedChatId !== chatId) return;
//       router.push("/messages" as any);
//     };

//     socket.on("chat:new-message", handleNewMessage);
//     socket.on("chat:messages-seen", handleMessagesSeen);
//     socket.on("chat:message-delivered-update", handleMessageDeliveredUpdate);
//     socket.on("chat:deleted", handleChatDeleted);

//     return () => {
//       socket.emit("chat:leave", { chatId });
//       socket.off("chat:new-message", handleNewMessage);
//       socket.off("chat:messages-seen", handleMessagesSeen);
//       socket.off("chat:message-delivered-update", handleMessageDeliveredUpdate);
//       socket.off("chat:deleted", handleChatDeleted);
//     };
//   }, [chatId, currentUserId, refreshReviewPrompt, router]);

//   useEffect(() => {
//     scrollRef.current?.scrollToEnd({ animated: true });
//   }, [messages]);

//   const handleSend = async () => {
//     const text = newMessage.trim();
//     if (!text || isSending) return;

//     try {
//       setIsSending(true);

//       const res = await api.post("/chats/message", {
//         chatId,
//         text,
//       });

//       const sentMessage = res.data as Message;

//       addMessageIfMissing(sentMessage);
//       setNewMessage("");
//       refreshReviewPrompt();

//       requestAnimationFrame(() => {
//         scrollRef.current?.scrollToEnd({ animated: true });
//       });
//     } catch (error: unknown) {
//       if (error instanceof AxiosError) {
//         showToast(error.response?.data?.message || "Failed to send message", "error");
//       } else {
//         showToast("Failed to send message", "error");
//       }
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleDeleteChat = async () => {
//     try {
//       await deleteChat(chatId);
//       setMenuOpen(false);
//       router.push("/messages" as any);
//     } catch (error: any) {
//       showToast(error?.response?.data?.message || "Failed to delete chat", "error");
//     }
//   };

//   const getReceiptLabel = (msg: Message) => {
//     if (!otherUser?._id) return "";

//     const seen = hasUserId(msg.seenBy || [], otherUser._id);
//     if (seen) return "Seen";

//     const delivered = hasUserId(msg.deliveredTo || [], otherUser._id);
//     if (delivered) return "Delivered";

//     return "Sent";
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
//         <View className="flex-1 items-center justify-center">
//           <ActivityIndicator size="large" color={colors.brand} />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["top"]}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View className="flex-1" style={{ backgroundColor: colors.surface }}>
//             <View
//               className="border-b"
//               style={{ borderColor: colors.border, backgroundColor: colors.surface }}
//             >
//               <View className="flex-row items-center justify-between px-4 py-3">
//                 <View className="min-w-0 flex-1 flex-row items-center gap-3">
//                   {showBackButton ? (
//                     <Pressable
//                       onPress={() => router.push("/messages" as any)}
//                       className="rounded-full p-2"
//                     >
//                       <ArrowLeft size={20} color={colors.text} />
//                     </Pressable>
//                   ) : null}

//                   {otherUser?.avatar && !otherUser?.isBanned ? (
//                     <Image
//                       source={{ uri: otherUser.avatar }}
//                       style={{ width: 40, height: 40, borderRadius: 20 }}
//                       contentFit="cover"
//                     />
//                   ) : (
//                     <View
//                       className="items-center justify-center rounded-full"
//                       style={{
//                         width: 40,
//                         height: 40,
//                         backgroundColor: colors.border,
//                       }}
//                     >
//                       <Text style={{ color: colors.text, fontWeight: "600" }}>
//                         {otherUserName.charAt(0).toUpperCase()}
//                       </Text>
//                     </View>
//                   )}

//                   <View className="min-w-0 flex-1">
//                     <Text
//                       numberOfLines={1}
//                       className="font-semibold"
//                       style={{ color: colors.text }}
//                     >
//                       {otherUserName}
//                     </Text>
//                     <Text numberOfLines={1} className="text-xs" style={{ color: colors.muted }}>
//                       About this listing
//                     </Text>
//                   </View>
//                 </View>

//                 <View>
//                   <Pressable
//                     onPress={() => setMenuOpen(true)}
//                     className="rounded-full p-2"
//                   >
//                     <MoreVertical size={20} color={colors.text} />
//                   </Pressable>

//                   <Modal
//                     transparent
//                     visible={menuOpen}
//                     animationType="fade"
//                     onRequestClose={() => setMenuOpen(false)}
//                   >
//                     <Pressable
//                       className="flex-1 bg-black/30"
//                       onPress={() => setMenuOpen(false)}
//                     >
//                       <View
//                         className="absolute right-4 top-24 w-48 rounded-2xl p-2"
//                         style={{ backgroundColor: colors.surface }}
//                       >
//                         {!otherUser?.isBanned ? (
//                           <Pressable
//                             onPress={() => {
//                               setMenuOpen(false);
//                               setReportTargetType("USER");
//                               setReportModalOpen(true);
//                             }}
//                             className="rounded-xl px-4 py-3"
//                           >
//                             <Text style={{ color: colors.text }}>Report seller</Text>
//                           </Pressable>
//                         ) : null}

//                         {!listingClosed ? (
//                           <Pressable
//                             onPress={() => {
//                               setMenuOpen(false);
//                               setReportTargetType("LISTING");
//                               setReportModalOpen(true);
//                             }}
//                             className="rounded-xl px-4 py-3"
//                           >
//                             <Text style={{ color: colors.text }}>Report listing</Text>
//                           </Pressable>
//                         ) : null}

//                         <Pressable
//                           onPress={handleDeleteChat}
//                           className="rounded-xl px-4 py-3"
//                         >
//                           <Text style={{ color: colors.danger }}>Delete chat</Text>
//                         </Pressable>
//                       </View>
//                     </Pressable>
//                   </Modal>
//                 </View>
//               </View>

//               {chatDetails?.listing ? (
//                 listingClosed ? (
//                   <View
//                     className="flex-row items-center gap-3 border-t px-4 py-2"
//                     style={{ borderColor: colors.border, backgroundColor: colors.background }}
//                   >
//                     <View
//                       className="items-center justify-center rounded border"
//                       style={{
//                         width: 56,
//                         height: 56,
//                         borderColor: colors.border,
//                         backgroundColor: colors.border,
//                       }}
//                     >
//                       <Text className="text-xs" style={{ color: colors.muted }}>
//                         Closed
//                       </Text>
//                     </View>

//                     <View className="min-w-0 flex-1">
//                       <Text
//                         numberOfLines={1}
//                         className="text-sm font-medium"
//                         style={{ color: colors.muted, textDecorationLine: "line-through" }}
//                       >
//                         {chatDetails.listing.title || "Ad closed"}
//                       </Text>
//                       <Text className="text-sm font-semibold" style={{ color: colors.danger }}>
//                         Ad closed
//                       </Text>
//                     </View>
//                   </View>
//                 ) : (
//                   <Pressable
//                     onPress={() =>
//                       router.push({
//                         pathname: "/listings/[slug]",
//                         params: { slug: chatDetails.listing.slug },
//                       } as any)
//                     }
//                     className="flex-row items-center gap-3 border-t px-4 py-2"
//                     style={{ borderColor: colors.border }}
//                   >
//                     <Image
//                       source={{
//                         uri:
//                           chatDetails.listing.images?.[0]?.url ||
//                           "https://via.placeholder.com/100x100",
//                       }}
//                       style={{ width: 56, height: 56, borderRadius: 10 }}
//                       contentFit="cover"
//                     />
//                     <View className="min-w-0 flex-1">
//                       <Text
//                         numberOfLines={1}
//                         className="text-sm font-medium"
//                         style={{ color: colors.text }}
//                       >
//                         {chatDetails.listing.title}
//                       </Text>
//                       <Text className="text-sm font-semibold" style={{ color: colors.success }}>
//                         ₦{Number(chatDetails.listing.price || 0).toLocaleString()}
//                       </Text>
//                     </View>
//                   </Pressable>
//                 )
//               ) : null}
//             </View>

//             <ScrollView
//               ref={scrollRef}
//               className="flex-1"
//               keyboardShouldPersistTaps="handled"
//               contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
//               style={{
//                 backgroundColor: resolvedTheme === "dark" ? colors.background : "#EDEDED",
//               }}
//               onContentSizeChange={() => {
//                 scrollRef.current?.scrollToEnd({ animated: true });
//               }}
//             >
//               {messages.length === 0 ? (
//                 <View className="flex-1 items-center justify-center py-10">
//                   <Text style={{ color: colors.muted }}>No messages yet</Text>
//                 </View>
//               ) : (
//                 messages.map((msg) => {
//                   const isMine = msg.sender._id === currentUserId;
//                   const receiptLabel = isMine ? getReceiptLabel(msg) : "";

//                   return (
//                     <View
//                       key={msg._id}
//                       className={`mb-3 flex ${isMine ? "items-end" : "items-start"}`}
//                     >
//                       <View
//                         className="max-w-[75%] rounded-2xl px-4 py-2"
//                         style={{
//                           backgroundColor: isMine ? colors.brand : colors.surface,
//                           borderBottomRightRadius: isMine ? 8 : 16,
//                           borderBottomLeftRadius: isMine ? 16 : 8,
//                         }}
//                       >
//                         <Text
//                           className="text-sm"
//                           style={{ color: isMine ? "#FFFFFF" : colors.text }}
//                         >
//                           {msg.text}
//                         </Text>

//                         <View className="mt-1 flex-row items-center justify-end gap-2">
//                           <Text
//                             className="text-[11px]"
//                             style={{ color: isMine ? "rgba(255,255,255,0.8)" : colors.muted }}
//                           >
//                             {formatBubbleTime(msg.createdAt)}
//                           </Text>
//                           {isMine ? (
//                             <Text
//                               className="text-[11px]"
//                               style={{ color: "rgba(255,255,255,0.8)" }}
//                             >
//                               {receiptLabel}
//                             </Text>
//                           ) : null}
//                         </View>
//                       </View>
//                     </View>
//                   );
//                 })
//               )}
//             </ScrollView>

//             <View
//               className="border-t p-3"
//               style={{ borderColor: colors.border, backgroundColor: colors.surface }}
//             >
//               {isBuyerViewing && chatDetails?.listing?._id ? (
//                 <RateSellerPrompt
//                   listingId={chatDetails.listing._id}
//                   chatId={chatId}
//                   refreshKey={reviewPromptRefreshKey}
//                 />
//               ) : null}

//               <View className="flex-row items-end gap-2">
//                 <TextInput
//                   value={newMessage}
//                   onChangeText={setNewMessage}
//                   placeholder="Type a message..."
//                   placeholderTextColor={colors.muted}
//                   multiline
//                   textAlignVertical="top"
//                   onFocus={() => {
//                     requestAnimationFrame(() => {
//                       scrollRef.current?.scrollToEnd({ animated: true });
//                     });
//                   }}
//                   className="flex-1 rounded-xl border px-4 py-3"
//                   style={{
//                     borderColor: colors.border,
//                     color: colors.text,
//                     backgroundColor: colors.surface,
//                     maxHeight: 120,
//                   }}
//                 />

//                 <Pressable
//                   onPress={handleSend}
//                   disabled={isSending || !newMessage.trim()}
//                   className="rounded-xl px-4 py-3"
//                   style={{
//                     backgroundColor:
//                       isSending || !newMessage.trim() ? colors.border : colors.brand,
//                   }}
//                 >
//                   <Text className="font-medium text-white">
//                     {isSending ? "Sending..." : "Send"}
//                   </Text>
//                 </Pressable>
//               </View>
//             </View>

//             <ReportChatTargetModal
//               open={reportModalOpen}
//               targetType={reportTargetType}
//               targetId={
//                 reportTargetType === "USER"
//                   ? otherUser && !otherUser.isBanned
//                     ? otherUser._id
//                     : undefined
//                   : !listingClosed
//                   ? chatDetails?.listing?._id || undefined
//                   : undefined
//               }
//               targetLabel={
//                 reportTargetType === "USER"
//                   ? otherUserName
//                   : chatDetails?.listing?.title || "Listing"
//               }
//               onClose={() => setReportModalOpen(false)}
//             />
//           </View>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }






import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import {
  ArrowLeft,
  MoreVertical,
  Mic,
  ImagePlus,
  Send,
  Trash2,
  Play,
  Pause,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

import { useAuthStore } from "@/store/auth-store";
import { api } from "@/libs/api";
import { connectSocket } from "@/libs/socket";
import { useTheme } from "@/hooks/useTheme";
import { useUI } from "@/hooks/useUI";
import ReportChatTargetModal from "@/components/chats/ReportChatTargetModal";
import RateSellerPrompt from "@/components/reviews/RateSellerPrompt";
import {
  deleteChat,
  type ChatAttachment,
  type Message,
  type Chat,
  type ListingPreview,
  sendChatMessage,
} from "@/features/chats/api";
import { getChatPreviewText } from "@/libs/chatMessageUtils";

type ChatDetails = Chat;

type PickedImage = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

function formatBubbleTime(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function getImageGridColumns(count: number) {
  if (count <= 1) return 1;
  if (count === 2) return 2;
  return 2;
}

function getMimeTypeFromUri(uri: string) {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".m4a")) return "audio/mp4";
  if (lower.endsWith(".aac")) return "audio/aac";
  if (lower.endsWith(".wav")) return "audio/wav";
  if (lower.endsWith(".ogg")) return "audio/ogg";
  if (lower.endsWith(".webm")) return "audio/webm";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  return "audio/mp4";
}

function buildFileName(prefix: string, uri: string, fallbackExt: string) {
  const last = uri.split("/").pop() || `${prefix}.${fallbackExt}`;
  return last.includes(".") ? last : `${last}.${fallbackExt}`;
}

function AudioBubble({
  uri,
  isMine,
  colors,
}: {
  uri: string;
  isMine: boolean;
  colors: {
    brand: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    danger: string;
    success: string;
  };
}) {
  const player = useAudioPlayer(uri || null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  const isPlaying = !!status?.playing;
  const currentTime = status?.currentTime ?? 0;
  const duration = status?.duration ?? 0;
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const barBg = isMine ? "rgba(255,255,255,0.25)" : colors.border;
  const fillBg = isMine ? "#FFFFFF" : colors.brand;
  const textColor = isMine ? "#FFFFFF" : colors.text;
  const metaColor = isMine ? "rgba(255,255,255,0.8)" : colors.muted;
  const buttonBg = isMine ? "rgba(255,255,255,0.16)" : colors.background;

  return (
    <View className="w-[240px] flex-row items-center gap-3">
      <Pressable
        onPress={() => {
          if (isPlaying) {
            player.pause();
          } else {
            if ((status?.didJustFinish ?? false) || currentTime >= duration) {
              player.seekTo(0);
            }
            player.play();
          }
        }}
        className="items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          backgroundColor: buttonBg,
        }}
      >
        {isPlaying ? (
          <Pause size={18} color={textColor} />
        ) : (
          <Play size={18} color={textColor} fill={textColor} />
        )}
      </Pressable>

      <View className="flex-1">
        <View
          className="overflow-hidden rounded-full"
          style={{ height: 6, backgroundColor: barBg }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: fillBg,
            }}
          />
        </View>

        <Text className="mt-1 text-xs" style={{ color: metaColor }}>
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </Text>
      </View>
    </View>
  );
}

function GalleryModal({
  visible,
  images,
  initialIndex,
  onClose,
  colors,
}: {
  visible: boolean;
  images: ChatAttachment[];
  initialIndex: number;
  onClose: () => void;
  colors: {
    brand: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    danger: string;
    success: string;
  };
}) {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<ChatAttachment> | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (!visible) return;
    setActiveIndex(initialIndex);
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
    });
  }, [visible, initialIndex]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/95">
        <SafeAreaView className="flex-1">
          <View className="flex-row items-center justify-between px-4 py-3">
            <Text className="text-sm font-medium text-white">
              {activeIndex + 1} / {images.length}
            </Text>

            <Pressable
              onPress={onClose}
              className="items-center justify-center rounded-full bg-white/10"
              style={{ width: 40, height: 40 }}
            >
              <X size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.public_id}-${index}`}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            initialScrollIndex={initialIndex}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveIndex(index);
            }}
            renderItem={({ item }) => (
              <View
                style={{ width }}
                className="flex-1 items-center justify-center px-4"
              >
                <Image
                  source={{ uri: item.url }}
                  style={{ width: width - 32, height: "80%" }}
                  contentFit="contain"
                />
              </View>
            )}
          />

          {images.length > 1 ? (
            <>
              <Pressable
                onPress={() => {
                  const next = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
                  flatListRef.current?.scrollToIndex({ index: next, animated: true });
                  setActiveIndex(next);
                }}
                className="absolute left-4 top-1/2 -mt-6 items-center justify-center rounded-full bg-white/10"
                style={{ width: 44, height: 44 }}
              >
                <ChevronLeft size={22} color="#FFFFFF" />
              </Pressable>

              <Pressable
                onPress={() => {
                  const next = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
                  flatListRef.current?.scrollToIndex({ index: next, animated: true });
                  setActiveIndex(next);
                }}
                className="absolute right-4 top-1/2 -mt-6 items-center justify-center rounded-full bg-white/10"
                style={{ width: 44, height: 44 }}
              >
                <ChevronRight size={22} color="#FFFFFF" />
              </Pressable>
            </>
          ) : null}

          <View className="px-4 pb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {images.map((item, index) => (
                  <Pressable
                    key={`${item.public_id}-thumb-${index}`}
                    onPress={() => {
                      flatListRef.current?.scrollToIndex({ index, animated: true });
                      setActiveIndex(index);
                    }}
                    className="overflow-hidden rounded-xl"
                    style={{
                      borderWidth: 2,
                      borderColor: index === activeIndex ? "#FFFFFF" : "transparent",
                    }}
                  >
                    <Image
                      source={{ uri: item.url }}
                      style={{ width: 56, height: 56 }}
                      contentFit="cover"
                    />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
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

  const [selectedImages, setSelectedImages] = useState<PickedImage[]>([]);
  const [voiceDraftUri, setVoiceDraftUri] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<ChatAttachment[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);
  const markingSeenRef = useRef(false);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const currentUserId = user?.id;
  const otherUser = chatDetails?.participants.find((p) => p._id !== currentUserId);

  const otherUserName = otherUser?.isBanned
    ? "Velora User"
    : otherUser
      ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() ||
        "Unknown User"
      : "Unknown User";

  const listingClosed = !!chatDetails?.listing?.isClosed;

  const hasUserId = (arr: Array<string | undefined | null> = [], userId?: string) =>
    arr.some((id) => String(id) === String(userId));

  const isBuyerViewing =
    Boolean(currentUserId) &&
    Boolean(chatDetails?.listing?.owner) &&
    String(currentUserId) !== String(chatDetails?.listing?.owner) &&
    !listingClosed;

  const composerMode =
    recorderState.isRecording || voiceDraftUri
      ? "voice"
      : selectedImages.length > 0
        ? "image"
        : "text";

  const waveformBars = useMemo(() => Array.from({ length: 28 }), []);

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
      if (seenChatId !== chatId || !seenBy) return;

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

  useEffect(() => {
    setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    }).catch(() => {});
  }, []);

  const pickImages = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast("Media library permission is required", "error");
        return;
      }

      clearVoiceDraft();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.85,
        selectionLimit: 5,
      });

      if (result.canceled) return;

      const picked: PickedImage[] = result.assets.slice(0, 5).map((asset, index) => ({
        uri: asset.uri,
        name:
          asset.fileName ||
          `chat-image-${Date.now()}-${index}.${asset.uri.split(".").pop() || "jpg"}`,
        type: asset.mimeType || "image/jpeg",
        size: asset.fileSize,
      }));

      setSelectedImages(picked);
    } catch {
      showToast("Failed to pick images", "error");
    }
  };

  const startRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        showToast("Microphone permission is required", "error");
        return;
      }

      setSelectedImages([]);
      clearVoiceDraft();

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      showToast("Failed to start recording", "error");
    }
  };

  const clearVoiceDraft = () => {
    if (recorderState.isRecording) {
      recorder.stop().catch(() => {});
    }
    setVoiceDraftUri(null);
  };

  const finishRecordingForPreview = async () => {
    try {
      if (!recorderState.isRecording) return recorder.uri || voiceDraftUri;

      await recorder.stop();
      const uri = recorder.uri;
      if (uri) {
        setVoiceDraftUri(uri);
      }
      return uri;
    } catch {
      showToast("Failed to stop recording", "error");
      return null;
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const text = newMessage.trim();
    const hasImages = selectedImages.length > 0;
    const hasVoiceDraft = !!voiceDraftUri;

    if ((!text && !hasImages && !hasVoiceDraft && !recorderState.isRecording) || isSending) {
      return;
    }

    try {
      setIsSending(true);

      let finalVoiceUri = voiceDraftUri;

      if (recorderState.isRecording) {
        finalVoiceUri = await finishRecordingForPreview();
      }

      const formData = new FormData();
      formData.append("chatId", chatId);
      
      if (text) {
        formData.append("text", text);
      }
      
      if (selectedImages.length > 0 && finalVoiceUri) {
        formData.append("messageType", "mixed");
      } else if (finalVoiceUri) {
        formData.append("messageType", "audio");
      } else if (selectedImages.length > 0) {
        formData.append("messageType", "image");
      } else {
        formData.append("messageType", "text");
      }

      selectedImages.forEach((file) => {
        formData.append("attachments", {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);
      });

      if (finalVoiceUri) {
        formData.append("attachments", {
          uri: finalVoiceUri,
          name: buildFileName("voice-note", finalVoiceUri, "m4a"),
          type: getMimeTypeFromUri(finalVoiceUri),
        } as any);
      }

      const sentMessage = await sendChatMessage(formData);

      addMessageIfMissing(sentMessage);
      setNewMessage("");
      setSelectedImages([]);
      setVoiceDraftUri(null);
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

  const openGallery = (images: ChatAttachment[], index: number) => {
    setGalleryImages(images);
    setGalleryIndex(index);
    setGalleryOpen(true);
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
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["top"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                          params: { slug: chatDetails.listing?.slug },
                        } as any)
                      }
                      className="flex-row items-center gap-3 border-t px-4 py-2"
                      style={{ borderColor: colors.border }}
                    >
                      <Image
                        source={{
                          uri:
                            chatDetails.listing?.images?.[0]?.url ||
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
                          {chatDetails.listing?.title}
                        </Text>
                        <Text className="text-sm font-semibold" style={{ color: colors.success }}>
                          ₦{Number(chatDetails.listing?.price || 0).toLocaleString()}
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
                  backgroundColor:
                    resolvedTheme === "dark" ? colors.background : "#EDEDED",
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
                    const imageAttachments =
                      msg.attachments?.filter((item) => item.type === "image") || [];
                    const audioAttachments =
                      msg.attachments?.filter((item) => item.type === "audio") || [];
                    const columns = getImageGridColumns(imageAttachments.length);

                    return (
                      <View
                        key={msg._id}
                        className={`mb-3 flex ${isMine ? "items-end" : "items-start"}`}
                      >
                        <View
                          className="max-w-[82%] rounded-2xl px-4 py-2"
                          style={{
                            backgroundColor: isMine ? colors.brand : colors.surface,
                            borderBottomRightRadius: isMine ? 8 : 16,
                            borderBottomLeftRadius: isMine ? 16 : 8,
                          }}
                        >
                          {msg.text ? (
                            <Text
                              className="text-sm"
                              style={{ color: isMine ? "#FFFFFF" : colors.text }}
                            >
                              {msg.text}
                            </Text>
                          ) : null}

                          {imageAttachments.length ? (
                            <View
                              className={msg.text ? "mt-2" : ""}
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                marginHorizontal: -4,
                              }}
                            >
                              {imageAttachments.map((attachment, index) => {
                                const showCountOverlay =
                                  imageAttachments.length > 4 && index === 3;
                                const extraCount = imageAttachments.length - 4;

                                if (imageAttachments.length > 4 && index > 3) {
                                  return null;
                                }

                                return (
                                  <Pressable
                                    key={`${msg._id}-img-${index}`}
                                    onPress={() => openGallery(imageAttachments, index)}
                                    style={{
                                      width: columns === 1 ? "100%" : "50%",
                                      padding: 4,
                                    }}
                                  >
                                    <View className="overflow-hidden rounded-xl">
                                      <Image
                                        source={{ uri: attachment.url }}
                                        style={{
                                          width: "100%",
                                          height: columns === 1 ? 220 : 120,
                                          borderRadius: 12,
                                        }}
                                        contentFit="cover"
                                      />

                                      {showCountOverlay ? (
                                        <View className="absolute inset-0 items-center justify-center bg-black/45">
                                          <Text className="text-2xl font-semibold text-white">
                                            +{extraCount}
                                          </Text>
                                        </View>
                                      ) : null}
                                    </View>
                                  </Pressable>
                                );
                              })}
                            </View>
                          ) : null}

                          {audioAttachments.length ? (
                            <View className={msg.text || imageAttachments.length ? "mt-2" : ""}>
                              {audioAttachments.map((attachment, index) => (
                                <View key={`${msg._id}-audio-${index}`}>
                                  <AudioBubble uri={attachment.url} isMine={isMine} colors={colors} />
                                </View>
                              ))}
                            </View>
                          ) : null}

                          {!msg.text && !msg.attachments?.length ? (
                            <Text
                              className="text-sm"
                              style={{ color: isMine ? "#FFFFFF" : colors.text }}
                            >
                              {getChatPreviewText(msg)}
                            </Text>
                          ) : null}

                          <View className="mt-1 flex-row items-center justify-end gap-2">
                            <Text
                              className="text-[11px]"
                              style={{
                                color: isMine ? "rgba(255,255,255,0.8)" : colors.muted,
                              }}
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

                {selectedImages.length ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-3"
                  >
                    <View className="flex-row gap-2">
                      {selectedImages.map((item, index) => (
                        <View key={`${item.uri}-${index}`} className="relative">
                          <Image
                            source={{ uri: item.uri }}
                            style={{ width: 72, height: 72, borderRadius: 14 }}
                            contentFit="cover"
                          />
                          <Pressable
                            onPress={() => removeSelectedImage(index)}
                            className="absolute -right-1 -top-1 items-center justify-center rounded-full"
                            style={{
                              width: 22,
                              height: 22,
                              backgroundColor: colors.surface,
                              borderWidth: 1,
                              borderColor: colors.border,
                            }}
                          >
                            <X size={12} color={colors.text} />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                ) : null}

                <View className="flex-row items-end gap-2">
                  <Pressable
                    onPress={pickImages}
                    disabled={isSending || recorderState.isRecording || !!voiceDraftUri}
                    className="items-center justify-center rounded-full"
                    style={{
                      width: 46,
                      height: 46,
                      backgroundColor: colors.background,
                      opacity: isSending || recorderState.isRecording || voiceDraftUri ? 0.5 : 1,
                    }}
                  >
                    <ImagePlus size={20} color={colors.text} />
                  </Pressable>

                  <View className="flex-1">
                    {composerMode === "voice" ? (
                      <View
                        className="flex-row items-center gap-3 rounded-full px-4 py-3"
                        style={{
                          minHeight: 52,
                          backgroundColor: resolvedTheme === "dark" ? "#1F2328" : "#222222",
                        }}
                      >
                        <Pressable
                          onPress={clearVoiceDraft}
                          disabled={isSending}
                          className="items-center justify-center rounded-full"
                          style={{ width: 32, height: 32 }}
                        >
                          <Trash2 size={18} color="#FFFFFF" />
                        </Pressable>

                        <View className="flex-1 flex-row items-center gap-3">
                          <View
                            className="rounded-full"
                            style={{
                              width: 10,
                              height: 10,
                              backgroundColor: "#F87171",
                            }}
                          />

                          <Text className="text-sm font-medium text-white">
                            {formatDuration(
                              recorderState.isRecording
                                ? (recorderState.durationMillis ?? 0) / 1000
                                : 0
                            )}
                          </Text>

                          <View className="flex-1 flex-row items-center justify-between">
                            {waveformBars.map((_, index) => (
                              <View
                                key={index}
                                style={{
                                  width: 3,
                                  borderRadius: 99,
                                  height:
                                    index % 5 === 0 ? 20 : index % 3 === 0 ? 14 : 10,
                                  backgroundColor: "rgba(255,255,255,0.75)",
                                }}
                              />
                            ))}
                          </View>
                        </View>
                      </View>
                    ) : (
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
                        className="flex-1 rounded-full border px-4 py-3"
                        style={{
                          borderColor: colors.border,
                          color: colors.text,
                          backgroundColor: colors.surface,
                          maxHeight: 120,
                          minHeight: 52,
                        }}
                      />
                    )}
                  </View>

                  {composerMode === "text" && !newMessage.trim() && !selectedImages.length ? (
                    <Pressable
                      onPress={startRecording}
                      disabled={isSending}
                      className="items-center justify-center rounded-full"
                      style={{
                        width: 46,
                        height: 46,
                        backgroundColor: colors.background,
                        opacity: isSending ? 0.5 : 1,
                      }}
                    >
                      <Mic size={20} color={colors.text} />
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={handleSend}
                      disabled={
                        isSending ||
                        (!newMessage.trim() &&
                          !selectedImages.length &&
                          !voiceDraftUri &&
                          !recorderState.isRecording)
                      }
                      className="items-center justify-center rounded-full"
                      style={{
                        width: 46,
                        height: 46,
                        backgroundColor:
                          isSending ||
                          (!newMessage.trim() &&
                            !selectedImages.length &&
                            !voiceDraftUri &&
                            !recorderState.isRecording)
                            ? colors.border
                            : colors.brand,
                      }}
                    >
                      {isSending ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Send size={20} color="#FFFFFF" />
                      )}
                    </Pressable>
                  )}
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

      <GalleryModal
        visible={galleryOpen}
        images={galleryImages}
        initialIndex={galleryIndex}
        onClose={() => setGalleryOpen(false)}
        colors={colors}
      />
    </>
  );
}
"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/libs/api";
import RateSellerPrompt from "./RateSeller";
import Link from "next/link";
import {
  EllipsisVertical,
  ArrowLeft,
  ImagePlus,
  Mic,
  X,
  Play,
  Pause,
  Trash2,
  SendHorizonal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import deleteChat from "@/controllers/deleteChat";
import { useRouter } from "next/navigation";
import { connectSocket } from "@/libs/socket";
import ReportChatTargetModal from "./ReportChatTargetModal";
import { AxiosError } from "axios";
import { getMessagePreviewText } from "@/libs/chatMessageUtils";

interface ChatAttachment {
  type: "image" | "audio";
  url: string;
  public_id: string;
  fileName?: string;
  mimeType: string;
  size: number;
  duration?: number | null;
}

interface Message {
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
  messageType?: "text" | "image" | "audio" | "mixed";
  attachments?: ChatAttachment[];
  previewText?: string;
}

interface ChatDetails {
  _id: string;
  listing: {
    _id?: string | null;
    slug?: string;
    title?: string;
    price?: string;
    images?: { url: string; public_id: string }[];
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
}

type LightboxState = {
  images: ChatAttachment[];
  index: number;
} | null;

function formatBubbleTime(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function getImageGridClass(count: number) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  return "grid-cols-2";
}

export default function ChatPage({
  chatId,
  showBackButton = false,
  onMarkedSeen,
  onLocalMessageSent,
}: {
  chatId: string;
  showBackButton?: boolean;
  onMarkedSeen?: (chatId: string) => void;
  onLocalMessageSent?: (payload: {
    chatId: string;
    message: Message;
  }) => void | Promise<void>;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetType, setReportTargetType] = useState<"USER" | "LISTING">(
    "USER"
  );

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingVoicePreview, setIsPlayingVoicePreview] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voicePreviewSeconds, setVoicePreviewSeconds] = useState(0);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const markingSeenRef = useRef(false);

  const currentUserId = user?.id ?? user?._id;

  const otherUser = chatDetails?.participants.find((p) => p._id !== currentUserId);

  const otherUserName = otherUser?.isBanned
    ? "Velora User"
    : otherUser
      ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim() ||
        "Unknown User"
      : "Unknown User";

  const listingClosed = !!chatDetails?.listing?.isClosed;

  const hasUserId = (
    arr: Array<string | undefined | null> = [],
    userId?: string
  ) => arr.some((id) => String(id) === String(userId));

  const isBuyerViewing =
    Boolean(currentUserId) &&
    Boolean(chatDetails?.listing?.owner) &&
    String(currentUserId) !== String(chatDetails?.listing?.owner) &&
    !listingClosed;

  const imagePreviewUrls = useMemo(
    () => selectedImages.map((file) => URL.createObjectURL(file)),
    [selectedImages]
  );

  const composerMode =
    isRecording || recordingBlob
      ? "voice"
      : selectedImages.length > 0
        ? "image"
        : "text";

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recordingStreamRef.current) {
        recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [imagePreviewUrls, recordingUrl]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;

      if (e.key === "Escape") {
        setLightbox(null);
        return;
      }

      if (e.key === "ArrowRight") {
        setLightbox((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            index: (prev.index + 1) % prev.images.length,
          };
        });
      }

      if (e.key === "ArrowLeft") {
        setLightbox((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            index: (prev.index - 1 + prev.images.length) % prev.images.length,
          };
        });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  const addMessageIfMissing = (incoming: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === incoming._id);
      if (exists) {
        return prev.map((m) => (m._id === incoming._id ? { ...m, ...incoming } : m));
      }
      return [...prev, incoming];
    });
  };

  const openSellerReport = () => {
    setMenuOpen(false);
    setReportTargetType("USER");
    setReportModalOpen(true);
  };

  const openListingReport = () => {
    setMenuOpen(false);
    setReportTargetType("LISTING");
    setReportModalOpen(true);
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
      onMarkedSeen?.(chatId);

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
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Failed to mark messages as seen",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("Failed to mark messages as seen", error.message);
      } else {
        console.error("Failed to mark messages as seen", error);
      }
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
          (msg: Message) =>
            msg.sender?._id !== currentUserId &&
            !hasUserId(msg.seenBy || [], currentUserId)
        );

        if (hasUnreadIncoming) {
          await markSeen();
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error("Failed to load chat", error.response?.data || error.message);
        } else if (error instanceof Error) {
          console.error("Failed to load chat", error.message);
        } else {
          console.error("Failed to load chat", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [chatId, currentUserId]);

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    const socket = connectSocket();
    socket.emit("chat:join", { chatId });

    const handleNewMessage = async ({
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
        await markSeen();
      }
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

          const alreadyDelivered = hasUserId(
            msg.deliveredTo || [],
            deliveredToUserId
          );
          if (alreadyDelivered) return msg;

          return {
            ...msg,
            deliveredTo: [...(msg.deliveredTo || []), deliveredToUserId],
          };
        })
      );
    };

    const handleChatDeleted = ({
      chatId: deletedChatId,
    }: {
      chatId: string;
    }) => {
      if (deletedChatId !== chatId) return;
      router.push("/messages");
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
  }, [chatId, currentUserId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (!imageFiles.length) return;

    clearVoicePreview();
    setSelectedImages(imageFiles.slice(0, 5));
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearVoicePreview = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }

    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current = null;
    }

    setRecordingBlob(null);
    setRecordingUrl("");
    setIsPlayingVoicePreview(false);
    setIsRecording(false);
    setRecordingSeconds(0);
    setVoicePreviewSeconds(0);
  };

  const startRecording = async () => {
    try {
      setSelectedImages([]);
      clearVoicePreview();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        const url = URL.createObjectURL(blob);

        setRecordingBlob(blob);
        setRecordingUrl(url);
        setIsRecording(false);
        setVoicePreviewSeconds((prev) => (prev > 0 ? prev : recordingSeconds));

        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        if (recordingStreamRef.current) {
          recordingStreamRef.current.getTracks().forEach((track) => track.stop());
          recordingStreamRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      setRecordingSeconds(0);
      setVoicePreviewSeconds(0);
      recorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const toggleVoicePreview = () => {
    if (!previewAudioRef.current) return;

    if (isPlayingVoicePreview) {
      previewAudioRef.current.pause();
      setIsPlayingVoicePreview(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingVoicePreview(true);
    }
  };

  const resetComposerMedia = () => {
    setSelectedImages([]);
    clearVoicePreview();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    const text = newMessage.trim();
    const hasImages = selectedImages.length > 0;
    const hasRecordedVoice = !!recordingBlob;

    if ((!text && !hasImages && !hasRecordedVoice && !isRecording) || isSending) {
      return;
    }

    try {
      setIsSending(true);

      let voiceBlobToSend = recordingBlob;

      if (isRecording && mediaRecorderRef.current) {
        voiceBlobToSend = await new Promise<Blob | null>((resolve) => {
          const recorder = mediaRecorderRef.current;

          if (!recorder || recorder.state === "inactive") {
            resolve(recordingBlob);
            return;
          }

          const finalSeconds = recordingSeconds;

          recorder.onstop = () => {
            const blob = new Blob(audioChunksRef.current, {
              type: recorder.mimeType || "audio/webm",
            });

            if (recordingTimerRef.current) {
              clearInterval(recordingTimerRef.current);
              recordingTimerRef.current = null;
            }

            if (recordingStreamRef.current) {
              recordingStreamRef.current.getTracks().forEach((track) => track.stop());
              recordingStreamRef.current = null;
            }

            const url = URL.createObjectURL(blob);
            setRecordingBlob(blob);
            setRecordingUrl(url);
            setIsRecording(false);
            setVoicePreviewSeconds(finalSeconds);

            resolve(blob);
          };

          recorder.stop();
        });
      }

      const formData = new FormData();
      formData.append("chatId", chatId);

      if (text) {
        formData.append("text", text);
      }

      selectedImages.forEach((file) => {
        formData.append("attachments", file);
      });

      if (voiceBlobToSend) {
        const extension = voiceBlobToSend.type === "audio/mp4" ? "m4a" : "webm";

        const voiceFile = new File(
          [voiceBlobToSend],
          `voice-note-${Date.now()}.${extension}`,
          {
            type: voiceBlobToSend.type || "audio/webm",
          }
        );

        formData.append("attachments", voiceFile);
      }

      const res = await api.post("/chats/message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const sentMessage = res.data as Message;
      addMessageIfMissing(sentMessage);
      setNewMessage("");
      resetComposerMedia();

      await onLocalMessageSent?.({
        chatId,
        message: sentMessage,
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Failed to send message", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("Failed to send message", error.message);
      } else {
        console.error("Failed to send message", error);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteChat = async () => {
    try {
      await deleteChat(chatId);
      setMenuOpen(false);
      router.push("/messages");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Failed to delete chat");
      } else {
        alert("Failed to delete chat");
      }
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

  const openImageGallery = (images: ChatAttachment[], index: number) => {
    const onlyImages = images.filter((item) => item.type === "image");
    setLightbox({
      images: onlyImages,
      index,
    });
  };

  const goPrevImage = () => {
    setLightbox((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        index: (prev.index - 1 + prev.images.length) % prev.images.length,
      };
    });
  };

  const goNextImage = () => {
    setLightbox((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        index: (prev.index + 1) % prev.images.length,
      };
    });
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center text-gray-500">
        Loading chat...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full h-full bg-white">
        <div className="border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              {showBackButton && (
                <button
                  onClick={() => router.push("/messages")}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              {otherUser?.avatar && !otherUser?.isBanned ? (
                <img
                  src={otherUser.avatar}
                  alt={otherUserName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                  {otherUserName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <p className="font-semibold truncate">{otherUserName}</p>
                <p className="text-xs text-gray-500 truncate">About this listing</p>
              </div>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <EllipsisVertical className="w-5 h-5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                  {!otherUser?.isBanned && (
                    <button
                      onClick={openSellerReport}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Report seller
                    </button>
                  )}

                  {!listingClosed && (
                    <button
                      onClick={openListingReport}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Report listing
                    </button>
                  )}

                  <button
                    onClick={handleDeleteChat}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    Delete chat
                  </button>
                </div>
              )}
            </div>
          </div>

          {chatDetails?.listing && (
            <>
              {listingClosed ? (
                <div className="flex items-center gap-3 px-4 py-2 border-t bg-gray-50 opacity-80 cursor-not-allowed">
                  <div className="w-14 h-14 rounded border bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    Closed
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate line-through text-gray-500">
                      {chatDetails.listing.title || "Ad closed"}
                    </p>
                    <p className="text-sm text-red-600 font-semibold">Ad closed</p>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/listings/${chatDetails.listing.slug}`}
                  className="flex items-center gap-3 px-4 py-2 border-t hover:bg-gray-50"
                >
                  <img
                    src={chatDetails.listing.images?.[0]?.url || "/placeholder.png"}
                    alt={chatDetails.listing.title || "Listing"}
                    className="w-14 h-14 rounded object-cover border"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {chatDetails.listing.title}
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      ₦{Number(chatDetails.listing.price || 0).toLocaleString()}
                    </p>
                  </div>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-[#EDEDED]">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No messages yet
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender._id === currentUserId;
              const receiptLabel = isMine ? getReceiptLabel(msg) : "";
              const imageAttachments =
                msg.attachments?.filter((item) => item.type === "image") || [];
              const audioAttachments =
                msg.attachments?.filter((item) => item.type === "audio") || [];

              return (
                <div
                  key={msg._id}
                  className={`mb-3 flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[78%]">
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        isMine
                          ? "bg-[#6D9773] text-white rounded-br-md"
                          : "bg-white text-gray-900 rounded-bl-md"
                      }`}
                    >
                      {!!msg.text && (
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.text}
                        </p>
                      )}

                      {!!imageAttachments.length && (
                        <div
                          className={`${msg.text ? "mt-2" : ""} grid gap-2 ${getImageGridClass(
                            imageAttachments.length
                          )}`}
                        >
                          {imageAttachments.map((attachment, index) => {
                            const extraCount = imageAttachments.length - 4;
                            const shouldOverlay =
                              imageAttachments.length > 4 && index === 3;

                            if (imageAttachments.length > 4 && index > 3) {
                              return null;
                            }

                            return (
                              <button
                                key={`${msg._id}-img-${index}`}
                                type="button"
                                onClick={() => openImageGallery(imageAttachments, index)}
                                className="relative block overflow-hidden rounded-xl"
                              >
                                <img
                                  src={attachment.url}
                                  alt={attachment.fileName || "Chat image"}
                                  className={`w-full object-cover border border-black/10 cursor-zoom-in ${
                                    imageAttachments.length === 1
                                      ? "max-h-80"
                                      : "h-36"
                                  }`}
                                />

                                {shouldOverlay && extraCount > 0 && (
                                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-3xl font-semibold">
                                    +{extraCount}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {!!audioAttachments.length && (
                        <div className={msg.text || imageAttachments.length ? "mt-2" : ""}>
                          {audioAttachments.map((attachment, index) => (
                            <audio
                              key={`${msg._id}-audio-${index}`}
                              controls
                              src={attachment.url}
                              className="w-full min-w-[220px]"
                            />
                          ))}
                        </div>
                      )}

                      {!msg.text && !msg.attachments?.length && (
                        <p className="text-sm">{getMessagePreviewText(msg)}</p>
                      )}

                      <div
                        className={`mt-1 flex items-center justify-end gap-2 text-[11px] ${
                          isMine ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        <span>{formatBubbleTime(msg.createdAt)}</span>
                        {isMine && <span>{receiptLabel}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-white p-3">
          {isBuyerViewing && chatDetails?.listing?._id && (
            <div className="mb-3">
              <RateSellerPrompt
                listingId={chatDetails.listing._id}
                chatId={chatId}
                refreshKey={messages.length}
              />
            </div>
          )}

          {!!selectedImages.length && (
            <div className="mb-3 flex flex-wrap gap-2">
              {imagePreviewUrls.map((url, index) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt={`Selected ${index + 1}`}
                    className="h-20 w-20 rounded-xl object-cover border"
                  />
                  <button
                    onClick={() => removeSelectedImage(index)}
                    className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePickImages}
            className="hidden"
          />

          <div className="flex items-end gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending || isRecording || !!recordingBlob}
              className="p-3 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
              title="Add image"
            >
              <ImagePlus className="w-5 h-5" />
            </button>

            <div className="flex-1">
              {composerMode === "voice" ? (
                <div className="flex items-center gap-3 rounded-full border bg-[#1F2328] px-4 py-3 text-white min-h-[52px]">
                  <button
                    onClick={clearVoicePreview}
                    disabled={isSending}
                    className="shrink-0 rounded-full p-1 hover:bg-white/10"
                    title="Discard voice note"
                  >
                    <Trash2 className="w-5 h-5 text-white/90" />
                  </button>

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400 shrink-0" />

                    <span className="text-sm font-medium shrink-0">
                      {formatDuration(
                        isRecording ? recordingSeconds : voicePreviewSeconds
                      )}
                    </span>

                    <div className="flex-1 h-8 rounded-full bg-white/10 flex items-center px-3 overflow-hidden">
                      <div className="flex items-center gap-[3px] w-full">
                        {Array.from({ length: 32 }).map((_, i) => (
                          <span
                            key={i}
                            className={`w-[3px] rounded-full bg-white/75 ${
                              i % 5 === 0
                                ? "h-6"
                                : i % 3 === 0
                                  ? "h-4"
                                  : "h-3"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {!isRecording && recordingUrl ? (
                    <button
                      onClick={toggleVoicePreview}
                      disabled={isSending}
                      className="shrink-0 rounded-full p-2 bg-white text-black hover:bg-white/90"
                      title={isPlayingVoicePreview ? "Pause preview" : "Play preview"}
                    >
                      {isPlayingVoicePreview ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                  ) : null}

                  {recordingUrl ? (
                    <audio
                      ref={previewAudioRef}
                      src={recordingUrl}
                      onPlay={() => setIsPlayingVoicePreview(true)}
                      onPause={() => setIsPlayingVoicePreview(false)}
                      onEnded={() => setIsPlayingVoicePreview(false)}
                      className="hidden"
                    />
                  ) : null}
                </div>
              ) : (
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  rows={1}
                  className="w-full resize-none border rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-[#6D9773] min-h-[52px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              )}
            </div>

            {composerMode === "text" && !newMessage.trim() && !selectedImages.length ? (
              <button
                onClick={startRecording}
                disabled={isSending}
                className="p-3 rounded-full bg-[#1F2328] text-white hover:opacity-90 disabled:opacity-50"
                title="Record voice note"
              >
                <Mic className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={
                  isSending ||
                  (!newMessage.trim() &&
                    !selectedImages.length &&
                    !recordingBlob &&
                    !isRecording)
                }
                className="p-3 rounded-full bg-[#6D9773] text-white hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Send"
              >
                <SendHorizonal className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

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
      </div>

      {lightbox && lightbox.images.length > 0 ? (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>

          {lightbox.images.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrevImage();
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                className="absolute right-4 md:right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goNextImage();
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="max-w-[95vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.index]?.url}
              alt={lightbox.images[lightbox.index]?.fileName || "Full screen preview"}
              className="max-h-[82vh] max-w-[95vw] object-contain"
            />

            {lightbox.images.length > 1 && (
              <div className="mt-4 flex items-center gap-2 overflow-x-auto max-w-[90vw]">
                {lightbox.images.map((image, index) => (
                  <button
                    key={`${image.public_id}-${index}`}
                    onClick={() =>
                      setLightbox((prev) =>
                        prev ? { ...prev, index } : prev
                      )
                    }
                    className={`rounded-lg overflow-hidden border-2 ${
                      index === lightbox.index
                        ? "border-white"
                        : "border-transparent opacity-70"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.fileName || `Preview ${index + 1}`}
                      className="h-14 w-14 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
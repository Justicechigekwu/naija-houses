import type { ChatAttachment, ChatMessage } from "@/types/listing";

export function getMessagePreviewText(message?: Partial<ChatMessage>) {
  if (!message) return "No messages yet";

  const text = message.text?.trim();
  if (text) return text;

  if (message.messageType === "audio") return "🎤 Voice note";

  if (message.messageType === "image") {
    const count = message.attachments?.length || 0;
    return count > 1 ? "📷 Images" : "📷 Image";
  }

  if (message.messageType === "mixed") return "📎 Attachment";

  if (message.attachments?.some((item) => item.type === "audio")) {
    return "🎤 Voice note";
  }

  if (message.attachments?.some((item) => item.type === "image")) {
    return message.attachments.length > 1 ? "📷 Images" : "📷 Image";
  }

  return "No messages yet";
}

export function isImageAttachment(attachment: ChatAttachment) {
  return attachment.type === "image";
}

export function isAudioAttachment(attachment: ChatAttachment) {
  return attachment.type === "audio";
}
import Chat from "../models/chatModel.js";
import Message from "../models/messageModels.js";
import {
  emitNewChatMessage,
  emitChatSeen,
  emitChatDeleted,
  emitUnreadChatCount,
} from "../service/realtimeService.js";
import { sendPushToUser } from "../service/pushNotificationService.js";

const mapParticipantPreview = (participant) => {
  if (!participant) return null;

  const obj = participant.toObject ? participant.toObject() : participant;

  if (obj.isBanned) {
    return {
      _id: obj._id,
      firstName: "Velora",
      lastName: "User",
      avatar: "",
      isBanned: true,
    };
  }

  return {
    _id: obj._id,
    firstName: obj.firstName,
    lastName: obj.lastName,
    avatar: obj.avatar,
    isBanned: false,
  };
};

const mapListingPreview = (listing) => {
  if (!listing) {
    return {
      _id: null,
      slug: null,
      title: "Ad closed",
      price: "",
      images: [],
      owner: null,
      publishStatus: "REMOVED",
      isClosed: true,
      closedLabel: "Ad closed",
    };
  }

  const obj = listing.toObject ? listing.toObject() : listing;

  const isClosed =
    obj.publishStatus === "REMOVED_BY_ADMIN" ||
    obj.publishStatus === "APPEAL_PENDING" ||
    obj.publishStatus === "EXPIRED" ||
    obj.publishStatus === "DRAFT" ||
    obj.publishStatus === "REJECTED";

  return {
    _id: obj._id,
    slug: obj.slug,
    title: isClosed ? "Ad closed" : obj.title,
    price: isClosed ? "" : obj.price,
    images: isClosed ? [] : obj.images || [],
    owner: obj.owner,
    publishStatus: obj.publishStatus,
    isClosed,
    closedLabel: isClosed ? "Ad closed" : "",
  };
};

const hydrateChatForClient = (chatDoc) => {
  const chat = chatDoc.toObject ? chatDoc.toObject() : chatDoc;

  return {
    ...chat,
    listing: mapListingPreview(chat.listing),
    participants: (chat.participants || []).map(mapParticipantPreview),
  };
};

export const startChat = async (req, res) => {
  try {
    const { listingId, ownerId } = req.body;
    const userId = req.user.id;

    let chat = await Chat.findOne({
      listing: listingId,
      participants: { $all: [userId, ownerId] },
    });

    if (!chat) {
      chat = await Chat.create({
        listing: listingId,
        participants: [userId, ownerId],
      });
    }

    const populatedChat = await Chat.findById(chat._id)
      .populate("listing", " slug title price images owner publishStatus")
      .populate("participants", "firstName lastName avatar isBanned");

    res.json(hydrateChatForClient(populatedChat));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to start chat" });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("listing", "slug title price images owner publishStatus")
      .populate("participants", "firstName lastName avatar isBanned")
      .sort({ updatedAt: -1 });

    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        const lastMessageDoc = await Message.findOne({ chat: chat._id })
          .sort({ createdAt: -1 })
          .populate("sender", "firstName lastName avatar isBanned")
          .lean();
    
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: req.user.id },
          seenBy: { $ne: req.user.id },
        });
    
        let lastMessage = lastMessageDoc;
    
        if (lastMessage) {
          let previewText = lastMessage.text || "";
    
          if (!previewText) {
            if (lastMessage.messageType === "audio") {
              previewText = "🎤 Voice note";
            } else if (lastMessage.messageType === "image") {
              previewText =
                lastMessage.attachments?.length > 1 ? "📷 Images" : "📷 Image";
            } else if (lastMessage.messageType === "mixed") {
              previewText = "📎 Attachment";
            }
          }
    
          lastMessage = {
            ...lastMessage,
            previewText,
          };
        }
    
        return {
          ...hydrateChatForClient(chat),
          lastMessage,
          unreadCount,
        };
      })
    );

    res.json(chatsWithLastMessage);
  } catch (error) {
    console.error("getChats error:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

export const getmessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName avatar isBanned");

    const safeMessages = messages.map((msg) => {
      const obj = msg.toObject();

      if (obj.sender?.isBanned) {
        obj.sender = {
          _id: obj.sender._id,
          firstName: "Velora",
          lastName: "User",
          avatar: "",
          isBanned: true,
        };
      }

      return obj;
    });

    res.json(safeMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("listing", "slug title price images owner publishStatus")
      .populate("participants", "firstName lastName avatar isBanned");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(hydrateChatForClient(chat));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
};

export const sendmessage = async (req, res) => {
  try {
    const { chatId } = req.body;
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    const chat = await Chat.findById(chatId).populate(
      "participants",
      "firstName lastName avatar isBanned"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const files = Array.isArray(req.files) ? req.files : [];

    const attachments = files.map((file) => {
      const mimeType = file.mimetype || "";
      const isAudio = mimeType.startsWith("audio/");

      return {
        type: isAudio ? "audio" : "image",
        url: file.path,
        public_id: file.filename || "",
        fileName: file.originalname || "",
        mimeType,
        size: file.size || 0,
        duration: null,
      };
    });

    if (!text && attachments.length === 0) {
      return res
        .status(400)
        .json({ message: "Message must contain text or an attachment" });
    }

    const audioCount = attachments.filter((item) => item.type === "audio").length;

    if (audioCount > 1) {
      return res
        .status(400)
        .json({ message: "Only one voice note is allowed per message" });
    }

    if (audioCount > 0 && attachments.length > 1) {
      return res.status(400).json({
        message: "Voice note cannot be combined with multiple attachments",
      });
    }

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text,
      attachments,
      deliveredTo: [req.user.id],
      seenBy: [req.user.id],
    });

    await Chat.findByIdAndUpdate(chatId, {
      $set: { updatedAt: new Date() },
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "firstName lastName avatar isBanned"
    );

    const safeMessage = populatedMessage.toObject();

    if (safeMessage.sender?.isBanned) {
      safeMessage.sender = {
        _id: safeMessage.sender._id,
        firstName: "Velora",
        lastName: "User",
        avatar: "",
        isBanned: true,
      };
    }

    const participantIds = chat.participants.map((p) => p._id.toString());
    const recipientIds = participantIds.filter((id) => id !== req.user.id);

    emitNewChatMessage(participantIds, {
      chatId,
      message: safeMessage,
    });

    for (const recipientId of recipientIds) {
      await emitUnreadChatCount(recipientId);
    }

    const senderParticipant = chat.participants.find(
      (p) => p._id.toString() === req.user.id
    );

    const otherParticipantName =
      senderParticipant?.isBanned
        ? "Velora User"
        : `${senderParticipant?.firstName || ""} ${
            senderParticipant?.lastName || ""
          }`.trim() || "New message";

    let pushBody = "Sent you a message";

    if (safeMessage.messageType === "audio") {
      pushBody = "🎤 Sent you a voice note";
    } else if (safeMessage.messageType === "image") {
      pushBody =
        safeMessage.attachments?.length > 1
          ? "📷 Sent you images"
          : "📷 Sent you an image";
    } else if (safeMessage.messageType === "mixed") {
      pushBody = text || "📎 Sent you an attachment";
    } else if (text) {
      pushBody = text;
    }

    for (const recipientId of recipientIds) {
      await sendPushToUser({
        userId: recipientId,
        title: otherParticipantName,
        body: pushBody,
        data: {
          route: `/messages/${chatId}`,
          chatId,
          type: "CHAT_NEW_MESSAGE",
          senderId: req.user.id,
          messageType: safeMessage.messageType,
        },
      });
    }

    return res.status(201).json(safeMessage);
  } catch (error) {
    console.error("sendmessage error:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

export const markChatAsSeen = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: req.user.id },
        seenBy: { $ne: req.user.id },
      },
      {
        $addToSet: { seenBy: req.user.id },
      }
    );

    const participantIds = chat.participants.map((p) => p.toString());

    emitChatSeen(participantIds, {
      chatId,
      seenBy: req.user.id,
    });

    for (const participantId of participantIds) {
      await emitUnreadChatCount(participantId);
    }

    res.json({
      message: "Messages marked as seen",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark messages as seen" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const participantIds = chat.participants.map((p) => p.toString());

    await Message.deleteMany({ chat: chatId });
    await Chat.findByIdAndDelete(chatId);

    emitChatDeleted(chatId, participantIds);

    for (const participantId of participantIds) {
      await emitUnreadChatCount(participantId);
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete chat" });
  }
};
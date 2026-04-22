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
        const lastMessage = await Message.findOne({ chat: chat._id })
          .sort({ createdAt: -1 })
          .populate("sender", "firstName lastName avatar isBanned")
          .lean();

        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: req.user.id },
          seenBy: { $ne: req.user.id },
        });

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
    const { chatId, text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Message text is required" });
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

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text: text.trim(),
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
        : `${senderParticipant?.firstName || ""} ${senderParticipant?.lastName || ""}`.trim() ||
          "New message";

    for (const recipientId of recipientIds) {
      await sendPushToUser({
        userId: recipientId,
        title: otherParticipantName,
        body: text.trim(),
        data: {
          route: `/messages/${chatId}`,
          chatId,
          type: "CHAT_NEW_MESSAGE",
          senderId: req.user.id,
        },
      });
    }

    res.json(safeMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
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
import Chat from "../models/chatModel.js";
import Message from "../models/messageModels.js";
import { getIO } from "../socket/index.js";
import { SOCKET_EVENTS } from "../utils/socketEventNames.js";

export const emitToUser = (userId, event, payload) => {
  const io = getIO();
  io.to(`user:${userId}`).emit(event, payload);
};

export const emitToUsers = (userIds = [], event, payload) => {
  const io = getIO();

  for (const userId of userIds) {
    io.to(`user:${userId}`).emit(event, payload);
  }
};

export const emitToChat = (chatId, event, payload) => {
  const io = getIO();
  io.to(`chat:${chatId}`).emit(event, payload);
};

export const emitToAdmins = (event, payload) => {
  const io = getIO();
  io.to("admin").emit(event, payload);
};

export const emitToAll = (event, payload) => {
  const io = getIO();
  io.emit(event, payload);
};

export const emitNewChatMessage = (participantIds = [], payload) => {
  emitToUsers(participantIds, SOCKET_EVENTS.CHAT_NEW_MESSAGE, payload);
};

export const emitChatSeen = (participantIds = [], payload) => {
  emitToUsers(participantIds, SOCKET_EVENTS.CHAT_MESSAGES_SEEN, payload);
};

export const emitChatDeliveredUpdate = (participantIds = [], payload) => {
  emitToUsers(participantIds, SOCKET_EVENTS.CHAT_MESSAGE_DELIVERED_UPDATE, payload);
};

export const emitChatDeleted = (chatId, participantIds = []) => {
  emitToUsers(participantIds, SOCKET_EVENTS.CHAT_DELETED, { chatId });
};

export const emitNotificationToUser = (userId, notification) => {
  emitToUser(userId, SOCKET_EVENTS.NOTIFICATION_NEW, notification);
};

export const emitUnreadNotificationCount = (userId, unreadCount) => {
  emitToUser(userId, SOCKET_EVENTS.NOTIFICATION_UNREAD_COUNT, {
    unreadCount,
  });
};

export const emitListingUpdated = (userId, payload) => {
  emitToUser(userId, SOCKET_EVENTS.LISTING_UPDATED, payload);
};

export const emitGlobalListingUpdated = (payload) => {
  emitToAll(SOCKET_EVENTS.LISTING_UPDATED, payload);
};

export const emitPaymentUpdated = (userId, payload) => {
  emitToUser(userId, SOCKET_EVENTS.PAYMENT_UPDATED, payload);
};

export const emitAdminPaymentsUpdated = (payload = {}) => {
  emitToAdmins(SOCKET_EVENTS.ADMIN_PAYMENTS_UPDATED, payload);
};

export const emitAdminReportsUpdated = (payload = {}) => {
  emitToAdmins(SOCKET_EVENTS.ADMIN_REPORTS_UPDATED, payload);
};

export const emitAdminAppealsUpdated = (payload = {}) => {
  emitToAdmins(SOCKET_EVENTS.ADMIN_APPEALS_UPDATED, payload);
};

export const emitAdminSupportUpdated = (payload = {}) => {
  emitToAdmins(SOCKET_EVENTS.ADMIN_SUPPORT_UPDATED, payload);
};

export const emitAdminUsersUpdated = (payload = {}) => {
  emitToAdmins(SOCKET_EVENTS.ADMIN_USERS_UPDATED, payload);
};

export const emitAdminOverviewUpdated = (payload = {}) => {
  emitToAdmins(SOCKET_EVENTS.ADMIN_OVERVIEW_UPDATED, payload);
};

export const emitAdminBadgesUpdated = (payload = {}) => {
  emitToAdmins(SOCKET_EVENTS.ADMIN_BADGES_UPDATED, payload);
};

export const emitUnreadChatCount = async (userId) => {
  const chats = await Chat.find({ participants: userId }).select("_id");
  const chatIds = chats.map((chat) => chat._id);

  const unreadCount = await Message.countDocuments({
    chat: { $in: chatIds },
    sender: { $ne: userId },
    seenBy: { $ne: userId },
  });

  emitToUser(userId, SOCKET_EVENTS.CHAT_UNREAD_COUNT, {
    unreadCount,
  });
};
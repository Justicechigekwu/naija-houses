export const SOCKET_EVENTS = {
  CONNECTION_READY: "connection:ready",

  CHAT_JOIN: "chat:join",
  CHAT_LEAVE: "chat:leave",
  CHAT_NEW_MESSAGE: "chat:new-message",
  CHAT_MESSAGES_SEEN: "chat:messages-seen",
  CHAT_UNREAD_COUNT: "chat:unread-count",
  CHAT_MESSAGE_DELIVERED: "chat:message-delivered",
  CHAT_MESSAGE_DELIVERED_UPDATE: "chat:message-delivered-update",
  CHAT_DELETED: "chat:deleted",

  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_UNREAD_COUNT: "notification:unread-count",

  LISTING_UPDATED: "listing:updated",
  PAYMENT_UPDATED: "payment:updated",
};
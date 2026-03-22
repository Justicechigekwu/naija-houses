import Chat from "../models/chatModel.js";
import Message from "../models/messageModels.js";
import { SOCKET_EVENTS } from "../utils/socketEventNames.js";
import { emitToUsers } from "../service/realtimeService.js";

export const registerSocketEvents = (io, socket) => {
  socket.on(SOCKET_EVENTS.CHAT_JOIN, async ({ chatId }) => {
    try {
      if (!chatId) return;

      const chat = await Chat.findById(chatId).select("participants");
      if (!chat) return;

      const isParticipant = chat.participants.some(
        (p) => p.toString() === socket.user.id
      );

      if (!isParticipant) return;

      socket.join(`chat:${chatId}`);
    } catch (error) {
      console.error("CHAT_JOIN error:", error);
    }
  });

  socket.on(SOCKET_EVENTS.CHAT_LEAVE, ({ chatId }) => {
    if (!chatId) return;
    socket.leave(`chat:${chatId}`);
  });

  socket.on(
    SOCKET_EVENTS.CHAT_MESSAGE_DELIVERED,
    async ({ chatId, messageId }) => {
      try {
        if (!chatId || !messageId) return;

        const chat = await Chat.findById(chatId).select("participants");
        if (!chat) return;

        const isParticipant = chat.participants.some(
          (p) => p.toString() === socket.user.id
        );

        if (!isParticipant) return;

        const message = await Message.findById(messageId);
        if (!message) return;

        const alreadyDelivered = (message.deliveredTo || []).some(
          (id) => id.toString() === socket.user.id
        );

        if (alreadyDelivered) return;

        await Message.updateOne(
          { _id: messageId },
          { $addToSet: { deliveredTo: socket.user.id } }
        );

        const otherParticipantIds = chat.participants
          .map((p) => p.toString())
          .filter((id) => id !== socket.user.id);

        emitToUsers(
          otherParticipantIds,
          SOCKET_EVENTS.CHAT_MESSAGE_DELIVERED_UPDATE,
          {
            chatId,
            messageId,
            deliveredToUserId: socket.user.id,
          }
        );
      } catch (error) {
        console.error("CHAT_MESSAGE_DELIVERED error:", error);
      }
    }
  );
};
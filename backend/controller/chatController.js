import Chat from "../models/chatModel.js";
import Message from "../models/messageModels.js";
import Listing from "../models/listingModels.js";


export const startChat = async (req, res) => {
    try {
        const { listingId, ownerId } = req.body;
        const userId = req.user.id;

        let chat = await Chat.findOne({
            listing: listingId,
            participants: {$all: [userId, ownerId] }
        });

        if (!chat) {
            chat = await Chat.create({
                listing: listingId,
                participants: [userId, ownerId],
            });
        }
        res.json(chat)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to start chat' });
    }
};

export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.user.id })
        .populate('listing', 'title')
        .populate('participants', 'name email avatar');

        const chatsWithLastMessage = await Promise.all(
            chats.map(async (chat) => {
                const lastMessage = await Message.findOne({ chat: chat._id})
                .sort({ createdAt: -1 })
                .lean();

                return {
                    ...chat.toObject(),
                    lastMessage,
                };
            })
        )
        res.json(chatsWithLastMessage)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch chats' });
    }
};

export const getmessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const message = await Message.find({ 
            chat: chatId 
        }).populate('sender', 'name email');
        res.json(message)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Failed to fetch messages' });
    }
};

export const sendmessage = async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const message = await Message.create({
            chat: chatId,
            sender: req.user.id,
            text
        });
        res.json(message);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to send message' });
    }
}
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        participants: [{ 
            type: mongoose.Schema.Types.ObjectId, ref: 'userModel'
        }],

        listing: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Listing'
        },
    },
    { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)
export default Chat;

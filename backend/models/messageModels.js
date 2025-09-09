import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Chat'
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId, ref: 'userModel'
        },

        text: {
            type: String, required: true
        },
    },
    { timestamps: true }
);

const Message =
 mongoose.models.Message || mongoose.model ('Message', messageSchema);
export default Message;
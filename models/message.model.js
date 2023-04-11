import mongoose from 'mongoose'
import User from "./user.model.js";

const messageSchema = mongoose.Schema({
    chatId: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    messageId: { type: Number, required: true },
    text: String,
    role: String,
    createdAt: { type: Date, default: Date.now }
})

const Message = mongoose.model('Message', messageSchema)

export default Message
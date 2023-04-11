import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    telegramId: { type: Number, required: true, unique: true },
    username: String,
    createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

export default User
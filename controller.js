import mongoose from 'mongoose'
import User from "./models/user.model.js"
import Message from "./models/message.model.js"


export const connectDB = async () => {
    console.log(process.env.API_GPT)

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err);
    }
}

export const checkAndCreateUser = async  ctx => {
    let user = await User.findOne({ telegramId: ctx.from.id })

    if (!user) {
        user = new User({
            telegramId: ctx.from.id,
            username: ctx.from.username
        })
        await user.save()
    }

    return user
}

export const saveMessage = async (ctx, role, user, msg) => {
    const message = new Message({
        userId: user._id,
        chatId: ctx.chat.id,
        messageId: ctx.message_id,
        text: msg,
        role
    })
    await message.save()

}



export const createPrompt = async (messages, prompt) => {
    let resultPrompt = messages.map(item => {
        return {
            "role": item.role,
            "content": item.text
        }
    }).reverse()


    resultPrompt.push({
        "role": 'user',
        "content": prompt
    })

    const results = await Promise.all(resultPrompt);
    return results
}

export const getLastMessage = async user => {
    const messages = await Message.find({ userId: user._id }).sort({ createdAt: -1 })
    return messages
}

export const getResponseGPT = async (openai, prompt) => {



    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: prompt
    })

    const content = await completion.data.choices[0].message?.content

    return content

}
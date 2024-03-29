import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import {
    checkAndCreateUser,
    connectDB,
    createPrompt,
    getLastMessage, getResponseGPT,
    saveMessage
} from "./controller.js";

dotenv.config()

import {Configuration, OpenAIApi} from "openai"

const configuration = new Configuration({
    apiKey: process.env.API_GPT,
})

const openai = new OpenAIApi(configuration)

connectDB()

const token = process.env.API_TELEGRAM


const bot = new TelegramBot(token, { polling: true})





bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Привет! Это тестовый бот на Node.js')
})


bot.on('message', async ctx => {

    const intervalId = setInterval(async () => {
        await bot.sendChatAction(ctx.chat.id, 'typing')
    }, 1000)

    const user = await checkAndCreateUser(ctx)
    const messages = await getLastMessage(user)
    const prompt = await createPrompt(messages, ctx.text)
    await saveMessage(ctx, 'user', user, ctx.text)




    let res = await getResponseGPT(openai, prompt)

    clearInterval(intervalId)


    await bot.sendMessage(ctx.chat.id, res)
    await saveMessage(ctx, 'assistant', user, res)

})
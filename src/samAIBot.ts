import { Bot } from "grammy";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: '/home/eduardo/Desktop/Runners/TBotAI/.env' });

const bot = new Bot (process.env.TELEGRAM_API_KEY!);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

async function generateText(prompt: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 20,
            }
        });
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: prompt,
                        }
                    ],
                }
            ]
        });
        return result.response.text();
        
    } catch (error) {
        console.error("Ocorreu um erro: ", error);
        return "";
    }

}

bot.command("start", (context) => context.reply("Iniciando"));

bot.command("pesquise", async (context) => {

    if (context.message?.text) {
        const inputText = context.message.text?.split(" ").slice(1).join(" ");

        if (!inputText) {
            return context.reply("Por favor, forneça um texto para pesquisar, exemplo: /pesquise sua busca aqui.");
        }

        await context.reply("Processando sua pergunta...");

        const aiResponse = await generateText(inputText)
    
        context.reply(aiResponse);
    } else {
        context.reply("Por favor, envie um comando válido.");
    }
});


bot.on("message", (context) => context.reply("/start inicia o bot.\n/pesquise faz uma pesquisa com AI, pode haver algumas limitações.\n"));

bot.start();
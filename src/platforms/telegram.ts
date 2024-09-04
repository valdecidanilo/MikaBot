import * as TelegramBot from 'node-telegram-bot-api';
import { tts } from '../services/fakeYou';
import { ask, train } from '../services/henry';
import { log } from '../services/logger';
const config = require("../../config.json")

export const initTelegram = () => {
  const telegram = new TelegramBot(config.TELEGRAM_TOKEN, { polling: true });

  telegram.on('message', async (message) => {
    const isPrivate = message.chat.type === "private";
    const chatId = message.chat.id;
    const user = message.from.first_name + " " + message.from.last_name;
    const input = message.text || "";
    const reply = message.reply_to_message?.text || "";

    if (reply) {
      const result = await train(reply, input);
      var extra = result ? "✅ Salvei!" : "❌ Não salvei";
      log("telegram", user, reply, input, extra);
      return;
    }

    if (isPrivate && input) {
      const result = await ask(input);
      telegram.sendMessage(chatId, result);
      log("telegram", user, input, result);
      return;
    }

    if (input && input.startsWith("!ask ")) {
      const data = input.replace("!ask ", "");
      const result = await ask(data);
      telegram.sendMessage(chatId, result);
      return;
    }

    if (input && input.startsWith("!tts ")) {
      const data = input.replace("!tts ", "");
      const result = await ask(data);
      const audio = await tts(result);
      telegram.sendAudio(chatId, audio);
      return;
    }
  });
  console.log(`Telegram Ready`);
}
import { Client, GatewayIntentBits, GuildVoiceChannelResolvable } from "discord.js"
import * as Fs from 'fs'
import { AudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel } from "@discordjs/voice";

import * as discordTTS from 'discord-tts';
import { ask } from "../services/henry";
import { log } from "../services/logger";
import { tts } from "../services/fakeYou";
import { receive, send } from "../services/falatron";

const config = require("../../config.json")
const mikaId = "651260463585427467";
const detentoId = "1067628462149488690";
const memberId = "1067628236248449104";

let voiceConnection;
let audioPlayer = new AudioPlayer();

export const initDiscord = () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  const prefix = "!";

  client.on("ready", () => {
    console.log(`Discord Ready`);

    receive((data) => {
      const audioResource = createAudioResource(data, { inputType: StreamType.Arbitrary, inlineVolume: true });
      audioPlayer.play(audioResource);
    })
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    // if (message.author.id == mikaId) return;

    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "tts") {

      var input = args.join("");
      var result = await ask(input);

      //const stream = discordTTS.getVoiceStream(result, { lang: 'pt' });

      send(result);

      //const stream = await tts(result);
      if (!voiceConnection || voiceConnection?.status === VoiceConnectionStatus.Disconnected) {
        voiceConnection = joinVoiceChannel({
          channelId: message.member.voice.channelId,
          guildId: message.guildId,
          adapterCreator: message.guild.voiceAdapterCreator,
        });
        voiceConnection = await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
      }

      voiceConnection.subscribe(audioPlayer);

      log("discord", message.member.displayName, input, result);
      return;
    }

    if (command === "ask") {
      var input = args.join(" ");
      var result = await ask(input);
      message.reply(result);

      log("discord", message.member.displayName, input, result);
      return;
    }

    if (command === "jail" && message.mentions?.members?.has(mikaId)) {
      const mika = message.mentions.members.get(mikaId);
      const channel = message.guild.channels.resolveId("1067259125123268619");
      const role = message.guild.roles.resolveId(detentoId);

      try {
        await mika.voice.setChannel(channel as GuildVoiceChannelResolvable);
        await mika.roles.set([role]);
      } catch (e) {
        await message.reply("Não deu certo!");
        return;
      }

      await message.reply("Toma!");
      return;
    }
  });

  client.login(config.DISCORD_TOKEN);
};

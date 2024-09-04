import Axios from "axios";
import * as FormData from "form-data";
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";

const config = require("../../config.json")

let messages = []

let text = fs.readFileSync('tuples.txt', 'utf8');
let lines = text.split("\n");

for (let line in lines) {
  const role = parseInt(line) % 2 ? "user" : "system";
  const content = lines[line].substring(6);
  messages.push({ role: role, content: content });
}

const configuration = new Configuration({
  apiKey: config.CHAT_GPT_TOKEN
});

const openai = new OpenAIApi(configuration);

// GPT-3.5
// export const ask = async (input: string): Promise<string> => {
//   messages.push({
//     role: "user", content: input
//   });

//   const response = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages,
//     temperature: 0.7,
//     max_tokens: 60,
//     top_p: 1.0,
//     frequency_penalty: 0.5,
//     presence_penalty: 0.0,
//   });

//   const result = response.data.choices[0].message;

//   messages.push({ ...result });

//   console.log(messages)

//   return result.content;
// }

// GPT-3
export const ask = async (input: string): Promise<string> => {
  text += "\nVocê: " + input;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text + "\n Mika: ",
    temperature: 0.02,
    max_tokens: 200,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
    stop: ["Você:"],
  });

  const result = response.data.choices[0].text || "ops deu ruim!";
  text += "\nMika: " + result;

  return result;
}

// export const ask = async (input: string): Promise<string> => {
//   var response = await Axios.get("https://homyapps.com.br/henry-bot/includes/api.php?input=" + input)
//   return response?.data;
// }

export const train = async (input: string, output: string): Promise<boolean> => {
  var body = new FormData();
  body.append("entrada_perg", input);
  body.append("entrada_resp", output);
  var response = await Axios({
    method: "post",
    url: "https://homyapps.com.br/henry-bot/treinar.php",
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
  })

  return response?.data?.includes("Salvo com sucesso")
}
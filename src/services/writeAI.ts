import { OpenAI, ClientOptions } from 'openai';
import * as fs from "fs";
import { models } from "../model";

const clientOptions: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY
};
let messages = []

let text = fs.readFileSync('tuples.txt', 'utf8');
let lines = text.split("\n");

for (let line in lines) {
  const role = parseInt(line) % 2 ? "user" : "system";
  const content = lines[line].substring(6);
  messages.push({ role: role, content: content });
}

const openai = new OpenAI(clientOptions);

export const ask = async (input: string): Promise<string> => {
    text += "\nVocê: " + input;
    const response = await openai.completions.create({
      model: models['gpt-3.5-turbo'],
      prompt: text + "\n Mika: ",
      temperature: 0.02,
      max_tokens: 200,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ["Você:"],
    });
  
    const result = response.choices[0].text || "ops deu ruim!";
    text += "\nMika: " + result;
  
    return result;
}
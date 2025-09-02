import OpenAI from "openai";

const token = process.env["OPENAI_API_KEY"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-5";

export async function chatWithGpt5(userMessage: string): Promise<string> {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });
  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage }
    ],
    model: model
  });
  return response.choices[0].message.content ?? "";
}

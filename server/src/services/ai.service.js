import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateResponse = () => {
  model.invoke("what is the capital of France?").then((response) => {
    console.log(response.text);
  });
};

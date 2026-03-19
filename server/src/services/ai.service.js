import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, AIMessage, SystemMessage } from "langchain";

const gemini_model = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL,
  apiKey: process.env.GEMINI_API_KEY,
});

const mistral_model = new ChatMistralAI({
  model: process.env.MISTRAL_MODEL,
  apiKey: process.env.MISTRAL_API_KEY,
});

export const generateResponse = async (msgs) => {
  const response = await gemini_model.invoke(
    msgs.map((msg) => {
      if (msg.role == "user") {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    }),
  );
  return response.text;
};

export const generateChatTitle = async (msg) => {
  const response = await mistral_model.invoke([
    new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
    new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${msg}"
            `),
  ]);

  return response.text;
};

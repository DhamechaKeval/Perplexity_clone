import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import Chat from "./../models/chat.model.js";
import Message from "./../models/message.model.js";

export const sendMessage = async (req, res) => {
  const { message, chat: chatId } = req.body;

  let title = null,
    chat = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await Chat.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await Message.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const allMessages = await Message.find({ chat: chatId || chat._id });

  const result = await generateResponse(allMessages);

  const aiMessage = await Message.create({
    chat: chatId || chat._id,
    content: result,
    role: "ai",
  });

  res.status(201).json({
    chat,
    title,
    aiMessage,
  });
};

export const getChat = async (req, res) => {
  const user = req.user;

  const chats = await Chat.find({ user: user.id });

  res.status(200).json({
    message: `Chat recived successfully`,
    chats,
  });
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: `Chat not Found`,
    });
  }

  const allMessages = await Message.find({
    chat: chatId,
  });

  res.status(200).json({
    message: `all messages recived successfully `,
    allMessages,
  });
};

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  await Message.deleteMany({
    chat: chatId,
  });

  if (!chat) {
    return res.status(404).json({
      message: `Chat Not Found`,
    });
  }

  req.status(200).json({
    message: `Chat deleted successfully`,
  });
};

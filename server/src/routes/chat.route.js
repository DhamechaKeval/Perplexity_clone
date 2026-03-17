import { Router } from "express";
import verifyUser from "../middlewares/auth.middleware.js";
import {
  deleteChat,
  getChat,
  getMessages,
  sendMessage,
} from "./../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/message", verifyUser, sendMessage);

chatRouter.get("/", verifyUser, getChat);

chatRouter.get("/:chatId/messages", verifyUser, getMessages);

chatRouter.delete("/delete/:chatId", verifyUser, deleteChat);

export default chatRouter;

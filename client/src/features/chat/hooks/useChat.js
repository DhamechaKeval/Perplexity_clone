import { useDispatch, useSelector } from "react-redux";
import { initSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  logout,
} from "./../service/chat.api";

import {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice";
import { setUser } from "../../auth/auth.slice";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  const handleSendMessage = async ({ message, chatId }) => {
    try {
      dispatch(setLoading(true));

      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;

      if (!chatId) {
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );
      }
      dispatch(
        addNewMessage({
          chatId: chat._id,
          content: message,
          role: "user",
        }),
      );
      dispatch(
        addNewMessage({
          chatId: chat._id,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );

      dispatch(setCurrentChatId(chat._id));
    } catch (err) {
      console.error(err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetChats = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getChats();
      const { chats } = data;

      const formattedChats = chats.reduce((acc, chat) => {
        acc[chat._id] = {
          id: chat._id,
          title: chat.title,
          messages: [],
          lastUpdated: chat.updatedAt,
        };
        return acc;
      }, {});

      dispatch(setChats(formattedChats));
    } catch (err) {
      console.error(err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOpenChat = async (chatId) => {
    try {
      if (chats[chatId]?.messages?.length > 0) {
        dispatch(setCurrentChatId(chatId));
        return;
      }

      dispatch(setLoading(true));

      const data = await getMessages(chatId);
      const { allMessages } = data;

      const formattedMessages = allMessages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );

      dispatch(setCurrentChatId(chatId));
    } catch (err) {
      console.error(err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      await logout();
      dispatch(setChats({}));
      dispatch(setCurrentChatId(null));
      dispatch(setUser(null));
      dispatch(setError(null));
    } catch (err) {
      console.error(err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    initSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleLogout,
    handleOpenChat,
  };
};

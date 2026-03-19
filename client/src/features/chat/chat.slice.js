import { createSlice } from "@reduxjs/toolkit";
import { deleteChat } from "./service/chat.api";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;

      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title,
          messages: [],
          lastUpdated: new Date().toISOString(),
        };
      }
    },

    replaceTempChat: (state, action) => {
      const { tempId, realChat } = action.payload;
      const tempChat = state.chats[tempId];
      if (!tempChat) return;
      delete state.chats[tempId];
      state.chats[realChat._id] = {
        id: realChat._id,
        title: realChat.title,
        messages: tempChat.messages,
        lastUpdated: new Date().toISOString(),
      };
    },

    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;

      if (!state.chats[chatId]) return;

      state.chats[chatId].messages.push({ content, role });
    },

    deleteChatById: (state, action) => {
      const chatId = action.payload;

      delete state.chats[chatId];

      // agar current chat delete ho gayi
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;

      if (!state.chats[chatId]) return;

      state.chats[chatId].messages = messages;
    },

    setChats: (state, action) => {
      state.chats = action.payload;
    },

    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  replaceTempChat,
  deleteChatById,
  addNewMessage,
  addMessages,
} = chatSlice.actions;
export default chatSlice.reducer;

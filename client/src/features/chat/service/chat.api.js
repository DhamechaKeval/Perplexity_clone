import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const sendMessage = async ({ message, chatId }) => {
  const response = await api.post("/chats/message", { message, chatId });
  return response.data;
};

export const getChats = async () => {
  const response = await api.get("/chats");
  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await api.get(`/chats/${chatId}/messages`);
  return response.data;
};

export const deleteChat = async ({ chatId }) => {
  const response = await api.delete(`/chats/delete/${chatId}`);
  return response.data;
};

export const logout = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};

import { initSocketConnection } from "../service/chat.socket";

export const useChat = () => {
  return initSocketConnection;
};

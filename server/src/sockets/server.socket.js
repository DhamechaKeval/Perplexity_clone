import { Server } from "socket.io";

let io;

export const initSocketServerr = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  console.log("Socket.io server is running");
  io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io server not initialized");
  }
  return io;
};

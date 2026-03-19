import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import http from "http";
import { initSocketServerr } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);

initSocketServerr(httpServer);

connectToDB();

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

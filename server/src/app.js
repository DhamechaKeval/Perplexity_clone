import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import chatRouter from "./routes/chat.route.js";
import path from "path";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const isDev = process.env.NODE_ENV !== "production";
app.use(
  cors({
    origin: isDev ? "http://localhost:5173" : true,
    credentials: true,
  }),
);
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;

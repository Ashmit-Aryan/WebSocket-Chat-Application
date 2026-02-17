import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import authRoutes from "./Routes/Auth.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB();
});

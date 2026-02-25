import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./Routes/Auth.js";
import messageRoutes from "./Routes/Message.js";
import connectDB  from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import * as dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors({ credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
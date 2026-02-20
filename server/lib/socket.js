
import * as Socket from 'socket.io';
import http from 'http';
import express from "express";
import {socketAuthMiddleware} from '../Middleware/socket.auth.middleware.js';
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);// Debugging line to check the CLIENT_URL value
const io = new Socket.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});

io.use(socketAuthMiddleware)

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}


const userSocketMap = {}

io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}, userId: ${socket.userId}, username: ${socket.user.username}`);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    io.emit("getUserOnline", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}, userId: ${socket.userId}, username: ${socket.user.username}`);
        delete userSocketMap[userId];
        io.emit("getUserOnline", Object.keys(userSocketMap));
    });
})

export {server, io, app};
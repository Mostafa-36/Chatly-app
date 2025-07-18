import express from "express";
import http from "http";
import { Server } from "socket.io";
import {
  clearUnreadFromSender,
  getUnreadMessagesGroupedBySender,
  unreadMessagesCache,
} from "../utils/getUnreadMessagesGroupedBySender.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";

const app = express();

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: ["http://localhost:5173"] } });

const usersSocketMap = {};
const currentChatMap = {};

const getSocketIdForUser = (userId) => {
  return usersSocketMap[userId];
};

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) usersSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(usersSocketMap));

  io.to(usersSocketMap[userId]).emit(
    "unreadMessages",
    await getUnreadMessagesGroupedBySender(userId)
  );

  socket.on("openChat", ({ userId, withUserId }) => {
    currentChatMap[userId] = withUserId;
  });

  socket.on("closeChat", (userId) => {
    delete currentChatMap[userId];
  });

  socket.on("markMessagesAsSeen", async ({ senderId, receiverId }) => {
    try {
      await Message.updateMany(
        {
          senderId: new mongoose.Types.ObjectId(senderId),
          receiverId: new mongoose.Types.ObjectId(receiverId),
          isSeen: false,
        },
        { $set: { isSeen: true } }
      );

      clearUnreadFromSender(receiverId, senderId);

      const receiverSocketId = getSocketIdForUser(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "unreadMessages",
          unreadMessagesCache[receiverId]
        );
      }
    } catch (err) {
      console.error(" Error marking messages as seen:", err.message);
    }
  });

  socket.on("disconnect", () => {
    delete usersSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(usersSocketMap));
  });
});

export { app, io, server, getSocketIdForUser, currentChatMap };

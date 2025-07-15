import express from "express";
import http from "http";
import { Server } from "socket.io";
import Message from ".././models/message.model.js";
import mongoose from "mongoose";

const app = express();

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: ["http://localhost:5173"] } });

const usersSocketMap = {};

const getSocketIdForUser = (userId) => {
  return usersSocketMap[userId];
};

const getUnreadMessagesGroupedBySender = async (userId) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const result = await Message.aggregate([
      {
        $match: {
          receiverId: userObjectId,
          isSeen: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    const unreadMap = {};
    result.forEach((entry) => {
      unreadMap[entry._id] = entry.count;
    });
    return unreadMap;
  } catch (err) {
    console.error("Error in aggregation:", err);
    return {};
  }
};

io.on("connection", async (socket) => {
  console.log("connected user:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) usersSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(usersSocketMap));

  io.to(usersSocketMap[userId]).emit(
    "unreadMessages",
    await getUnreadMessagesGroupedBySender(userId)
  );

  socket.on("disconnect", () => {
    console.log("disconnected user:", socket.id);

    delete usersSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(usersSocketMap));
  });
});

export { app, io, server, getSocketIdForUser };

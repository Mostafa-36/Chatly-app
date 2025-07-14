import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: ["http://localhost:5173"] } });

const usersSocketMap = {};

const getSocketIdForUser = (userId) => {
  return usersSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("connected user:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) usersSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(usersSocketMap));

  socket.on("disconnect", () => {
    console.log("disconnected user:", socket.id);

    delete usersSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(usersSocketMap));
  });
});

export { app, io, server, getSocketIdForUser };

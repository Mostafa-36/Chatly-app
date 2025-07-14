import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import globalErrorHandler from "./middleware/globalError.middleware.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHTEXCEPTION");
  console.log(err.name, err.message);

  process.exit(1);
});

const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(globalErrorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const Server = server.listen(process.env.PORT || 5001, () => {
  console.log("Sever is connecting on port:" + process.env.PORT);
  connectDB();
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLEDREJECTION: shuting down...");
  console.log(err.name, err.message);

  Server.close(() => {
    process.exit(1);
  });
});

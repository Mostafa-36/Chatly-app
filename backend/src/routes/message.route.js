import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getChatContacts,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protect, getChatContacts);

router.get("/:id", protect, getMessages);

router.post("/:id", protect, sendMessage);

export default router;

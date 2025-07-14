import cloudinary from "../lib/cloudinary.js";
import { getSocketIdForUser, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";

export const getChatContacts = catchAsync(async (req, res, next) => {
  const loggedInUserId = req.user._id;
  const users = await User.find({ _id: { $ne: loggedInUserId } });

  res.status(200).json({
    status: "success",
    data: users,
  });
});

export const getMessages = catchAsync(async (req, res, next) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;
  const messages = await Message.find({
    $or: [
      {
        senderId: userToChatId,
        receiverId: myId,
      },
      {
        senderId: myId,
        receiverId: userToChatId,
      },
    ],
  });

  res.status(200).json({
    status: "success",

    data: messages,
  });
});

export const sendMessage = catchAsync(async (req, res, next) => {
  const { id: receiverId } = req.params;
  const { text, image } = req.body;
  const senderId = req.user._id;
  let imageUrl;

  if (image) {
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "chatly-messages",
    });
    imageUrl = uploadResult.secure_url;
  }

  const message = await Message.create({
    receiverId,
    senderId,
    text,
    image: imageUrl,
  });

  const receiverSocketId = getSocketIdForUser(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", message);
  }

  res.status(201).json({ status: "success", data: message });
});

import mongoose from "mongoose";
import Message from "../models/message.model.js";

export const unreadMessagesCache = {};

export const getUnreadMessagesGroupedBySender = async (userId, isOnline) => {
  if (unreadMessagesCache[userId] && isOnline)
    return unreadMessagesCache[userId];

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

    unreadMessagesCache[userId] = unreadMap;

    return unreadMap;
  } catch (err) {
    console.error("Error in aggregation:", err);
    return {};
  }
};

export const incrementUnreadCount = (receiverId, senderId) => {
  if (!unreadMessagesCache[receiverId]) unreadMessagesCache[receiverId] = {};
  if (!unreadMessagesCache[receiverId][senderId])
    unreadMessagesCache[receiverId][senderId] = 0;

  unreadMessagesCache[receiverId][senderId] += 1;
};

export const clearUnreadFromSender = (userId, senderId) => {
  if (unreadMessagesCache[userId]) {
    delete unreadMessagesCache[userId][senderId];
  }
};

import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import { getSocketId, io } from "../socket/socket.js"


export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const { message, imageUrl } = req.body;

  if (!senderId || !receiverId || (!message && !imageUrl)) {
    return next(new errorHandler("Message or image is required", 400));
  }

  // Find or create the conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  // Determine message type
  const messageType = imageUrl ? 'image' : 'text';

  // Create message
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message: message || null,
    imageUrl: imageUrl || null,
    messageType ,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  const socketId = getSocketId(receiverId);
  io.to(socketId).emit("newMessage", newMessage);

  res.status(200).json({
    success: true,
    responseData: newMessage,
  });
});


export const getMessages = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const otherParticipantId = req.params.otherParticipantId;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;

  if (!myId || !otherParticipantId) {
    return next(new errorHandler("All fields are required", 400));
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [myId, otherParticipantId] },
  });

  if (!conversation) {
    return res.status(200).json({
      success: true,
      responseData: { messages: [], hasMore: false },
    });
  }

  const totalMessages = conversation.messages.length;
  const hasMore = (page * limit) < totalMessages;

  // Get messages sorted from newest to oldest
  const messages = await Message.find({
    _id: { $in: conversation.messages },
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    responseData: {
      messages,
      hasMore,
    },
  });
});

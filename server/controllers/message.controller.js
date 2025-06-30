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
  isDeletedForEveryone: { $ne: true },
  deletedFor: { $ne: myId },
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


export const deleteForMe = asyncHandler( async (req, res) => {
  const  userId  = req.user._id;
  const { id } = req.params;

  const message = await Message.findById(id);
  if (!message) return res.status(404).send("Message not found");

  if (!message.deletedFor.includes(userId)) {
    message.deletedFor.push(userId);
    await message.save();
  }

  res.send({ success: true });
});

export const deleteForEveryone = asyncHandler(async (req, res) => {
  const  userId  = req.user._id;
  const { id } = req.params;

  const message = await Message.findById(id);
  if (!message) return res.status(404).send("Message not found");

  if (message.senderId.toString() !== userId)
    return res.status(403).send("Unauthorized");

  message.isDeletedForEveryone = true;
  await message.save();

  const { receiverId } = message;
  const senderSocketId = getSocketId(message.senderId.toString());
  const receiverSocketId = getSocketId(receiverId.toString());

  io.to(senderSocketId).emit("messageDeleted", { messageId: id });
  io.to(receiverSocketId).emit("messageDeleted", { messageId: id });

  res.send({ success: true });
})



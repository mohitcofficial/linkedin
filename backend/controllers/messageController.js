import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Message } from "../models/Message.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Conversation } from "../models/Conversation.js";

export const createMessage = catchAsyncError(async (req, res, next) => {
  const { senderId, conversationId, message } = req.body;

  if (!senderId || !conversationId || !message)
    return next(new ErrorHandler("Enter all the fields", 401));

  let conversation = await Conversation.findOne({ _id: conversationId });

  if (!conversation)
    return next(new ErrorHandler("No conversation Found ", 404));

  const newMessage = await Message.create({
    senderId,
    conversationId,
    message,
  });

  res.status(200).json({
    success: true,
    message: "Message Created Successfully",
    newMessage,
  });
});

export const getMessages = catchAsyncError(async (req, res, next) => {
  const conversationId = req.params.id;

  if (!conversationId)
    return next(new ErrorHandler("Enter the conversationId", 401));

  const messages = await Message.find({ conversationId }).sort({
    updatedAt: -1,
  });

  res.status(200).json({
    success: true,
    messages,
  });
});

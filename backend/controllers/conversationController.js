import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Conversation } from "../models/Conversation.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createConversation = catchAsyncError(async (req, res, next) => {
  const { id1, id2 } = req.body;

  if (!id1 || !id2) return next(new ErrorHandler("Enter both the fields", 401));

  const cur1 = [id1, id2];
  const cur2 = [id2, id1];

  let conversation = await Conversation.findOne({ users: cur1 });
  if (conversation)
    return next(new ErrorHandler("Conversation already present", 401));
  conversation = await Conversation.findOne({ users: cur2 });
  if (conversation)
    return next(new ErrorHandler("Conversation already present", 401));

  conversation = await Conversation.create({ users: [id1, id2] });

  res.status(200).json({
    message: "Conversation Created Successfully",
    conversation,
  });
});

export const getUserConversation = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) return next(new ErrorHandler("Enter the User-id", 401));

  const conversations = await Conversation.find({
    users: { $elemMatch: { $eq: userId } },
  }).sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    conversations,
  });
});

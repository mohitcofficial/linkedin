import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messsage",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);

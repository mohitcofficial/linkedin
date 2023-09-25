import express from "express";
import {
  createConversation,
  getUserConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

router.route("/conversation/create").post(createConversation);
router.route("/conversations/:id").get(getUserConversation);

export default router;

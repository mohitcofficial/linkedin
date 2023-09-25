import express from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/messageController.js";

const router = express.Router();

router.route("/message/create").post(createMessage);
router.route("/messages/:id").get(getMessages);

export default router;

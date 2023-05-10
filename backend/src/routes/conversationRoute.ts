import express from "express";
import * as conversationController from "../controllers/conversationController";

const router = express.Router();

router.post("/sendMessage", conversationController.sendMessage);

router.get("/:sender/:receiver", conversationController.getConversation);

export default router;
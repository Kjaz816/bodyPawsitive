import express from "express";
import * as conversationController from "../controllers/conversationController";

const router = express.Router();

router.post("/sendMessage", conversationController.sendMessage);

router.get("/getConversation/:sender/:receiver", conversationController.getConversation);

router.get("/getConversations/:username", conversationController.getAllConversations);

export default router;
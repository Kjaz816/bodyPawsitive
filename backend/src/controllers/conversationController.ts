import { RequestHandler } from "express";
import ConversationModel from "../models/conversationModel";

interface MessageBody {
    sender: string;
    receiver: string;
    message: string;
}

interface ConversationBody {
    participants: string[];
    messages: {
        sender: string;
        content: string;
        date: Date;
    }[];
    lastMessage: {
        sentBy: string;
        content: string;
        date: Date;
        seen: boolean;
    }
}

export const sendMessage: RequestHandler<unknown, unknown, MessageBody, unknown> = async (req, res, next) => {
    const { sender, receiver, message } = req.body;
    if (!sender || !receiver || !message) {
        return res.status(400).json({ message: "Missing required fields!" });
    }
    if (sender === receiver) {
        return res.status(400).json({ message: "Cannot send message to yourself!" });
    }
    try {
        const conversation = await ConversationModel.findOne({
            $and: [
                { participants: { $in: [sender] } },
                { participants: { $in: [receiver] } },
                { participants: { $size: 2 } }
            ]
        }).exec();
        if (conversation) {
            conversation.messages.push({
                sender: sender,
                content: message,
                date: new Date()
            });
            conversation.lastMessage = {
                sentBy: sender,
                content: message,
                date: new Date(),
                seen: false
            }
            const Update = await ConversationModel.findOneAndUpdate({ participants: { $all: [sender, receiver] } }, conversation, { new: true }).exec();
            return res.status(200).json({ Update });
        } else {
            const newConversation = await ConversationModel.create({
                participants: [sender, receiver],
                messages: [{
                    sender: sender,
                    content: message,
                    date: new Date()
                }],
                lastMessage: {
                    sentBy: sender,
                    content: message,
                    date: new Date(),
                    seen: false
                }
            }).catch(error => {
                console.error(error);
                return res.status(500).json({ message: error });
            });
            return res.status(200).json({ newConversation });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getConversation: RequestHandler<{ sender: string, receiver: string }, unknown, unknown, unknown> = async (req, res, next) => {
    const sender = req.params.sender;
    const receiver = req.params.receiver;
    try {
        const conversation = await ConversationModel.findOne({ participants: { $all: [sender, receiver] } }).exec();
        if (!conversation) {
            return res.status(400).json({ message: "Conversation does not exist!" });
        }
        return res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getAllConversations: RequestHandler<{ username: string }, unknown, unknown, unknown> = async (req, res, next) => {
    const username = req.params.username;
    try {
        const conversations = await ConversationModel.find({ participants: { $in: [username] } }).exec();
        if (!conversations) {
            return res.status(400).json({ message: "No conversations found!" });
        }
        return res.status(200).json(conversations);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getUnreadChats: RequestHandler<{ username: string }, unknown, unknown, unknown> = async (req, res, next) => {
    const username = req.params.username;
    try {
        const conversations = await ConversationModel.find({ participants: { $in: [username] }, "lastMessage.seen": false }).exec();
        if (!conversations) {
            return res.status(400).json({ message: "No conversations found!" });
        }
        return res.status(200).json(conversations);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const setRead: RequestHandler<{ username: string, otherUser: string }, unknown, unknown, unknown> = async (req, res, next) => {
    const username = req.params.username;
    const otherUser = req.params.otherUser;
    try {
        const conversation = await ConversationModel.findOne({ participants: { $all: [username, otherUser] } }).exec();
        if (!conversation) {
            return res.status(400).json({ message: "Conversation does not exist!" });
        }
        if (conversation.lastMessage) {
        conversation.lastMessage.seen = true;
        } else {
            return res.status(400).json({ message: "Conversation does not exist!" });
        }
        const Update = await ConversationModel.findOneAndUpdate({ participants: { $all: [username, otherUser] } }, conversation, { new: true }).exec();
        return res.status(200).json({ Update });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}
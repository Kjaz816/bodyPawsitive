import { Conversation } from "../models/conversationModel";
import { Message } from "../models/messageModel";

const deployed = false;

const url = deployed ? "https://bodypositive.onrender.com" : "";

// Api calls to backend

export const sendMessage = async (message : Message) => {
    const response = await fetch(url + "/api/conversations/sendMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    });
    const data = await response.json();
    return data;
}

export const getConversation = async (sender: string, receiver: string) => {
    const response = await fetch(url + "/api/conversations/getConversation/" + sender + "/" + receiver, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}

export const getConversations = async (username: string) => {
    const response = await fetch(url + "/api/conversations/getConversations/" + username, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}
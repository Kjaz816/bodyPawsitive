import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import * as api from "../apiControllers/conversationController";
import { Message } from "../models/messageModel";
import TopNavigation from "../components/TopNavigation";

interface ConversationBody {
    participants: string[];
    messages: {
        _id: string;
        sender: string;
        content: string;
        date: Date;
    }[];
    lastMessage: {
        sentBy: string;
        content: string;
        date: Date;
        seen: boolean;
    };
}


const Chat = () => {
    const url = window.location.href;
    const chattingWith = url.substring(url.lastIndexOf('/') + 1);
    const username = sessionStorage.getItem("loggedInUser");

    const [chatMessage, setChatMessage] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<ConversationBody>();

    const sendMessage = () => {
        if (username) {
            const message: Message = {
                sender: username,
                receiver: chattingWith,
                message: chatMessage
            }
            api.sendMessage(message)
                .then(() => {
                    window.location.reload();
                })
                .catch((error) => console.error(error));
        }
    }


    const getMessages = () => {
        if (username) {
            api.getConversation(username, chattingWith)
                .then((data) => {
                    setChatMessages(data);
                }
                )
        } else {
            window.location.href = "/Login";
        }
    }

    useEffect(() => {
        getMessages();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setChatMessage(() => (value));
    };


    return (
        <div>
            <TopNavigation/>
            
            <a href="/">Home</a>
            <br />
            <a href="/Users">To Users</a>
            <br />
            <a href="/Chat">To Chats</a>
            <br />
            <a href={`/Users/${chattingWith}`}>To {chattingWith}'s Profile</a>
            <h1>Send A Message</h1>
            <div>
                {chatMessages?.messages?.map((message) => (
                    <div key={message._id}>
                        <p><b>Message Sender:</b> {message.sender}</p>
                        <p>{message.content}</p>
                        <p>{new Date(message.date).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })}</p>
                        <br />
                    </div>
                ))}
            </div>

            <TextField
                id="chatBox"
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                onChange={handleChange}
            />
            <button onClick={sendMessage}>Send</button>

        </div>
    )
}

export default Chat
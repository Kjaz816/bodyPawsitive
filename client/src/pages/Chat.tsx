import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import * as api from "../apiControllers/conversationController";
import { Message } from "../models/messageModel";
import TopNavigation from "../components/TopNavigation";
import NextButton from "../lib/icons/RightIndicator.svg";
import BackButton from "../lib/icons/LeftIndicator.svg";
import "../styling/Chat.css";

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
            <div style={{display: 'flex'}}>
                <button onClick={() =>   { window.location.href = `/Chat`}} className="left-indication">
                    <img src={BackButton} className="navigation-button"></img>
                    <p className="navigation-text">Back to Chat</p>         
                </button>
                <button onClick={() => { window.location.href = `/Users/${chattingWith}` }} className="right-indication">
                    <img src={NextButton} className="navigation-button"></img>
                    <p className="navigation-text">To {chattingWith}'s Profile</p>
                </button>
            </div>
            <h1 className = "add-edit-titles" style={{fontSize:"30px"}}>{chattingWith}</h1>
            <div className = "chat-container">
                <div>
                    {chatMessages?.messages?.map((message) => (
                        <div className="message-container" key={message._id}>
                            <p><b>Message Sender:</b> {message.sender}</p>
                            <p>{message.content}</p>
                            <p>{new Date(message.date).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })}</p>
                            <br />
                        </div>
                    ))}
                </div>
                <div className="send-container">
                        <TextField
                            id="chatBox"
                            label="Message"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    <button className = "send-button" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat
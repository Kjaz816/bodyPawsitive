import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

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
        fetch(`https://bodypositive.onrender.com/api/conversations/sendMessage/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sender: username,
                receiver: chattingWith,
                message: chatMessage
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => console.error(error));
    }

    const getMessages = () => {
        fetch(`https://bodypositive.onrender.com/api/conversations/getConversation/${username}/${chattingWith}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setChatMessages(data);
            }).catch((error) => console.error(error));
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
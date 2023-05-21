import { useEffect, useState } from "react";
import * as api from "../apiControllers/conversationController";
import { Conversation } from "../models/conversationModel";
import TopNavigation from "../components/TopNavigation";
import "../styling/ChatList.css";

const ChatList = () => {

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const username = sessionStorage.getItem("loggedInUser");

    const getAllConversations = () => {
        if (username) {
            api.getConversations(username)
                .then((data) => {
                    setConversations(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    useEffect(() => {
        getAllConversations();
    }, []);

    return (
        <div className="page-container-chat-list">
            <TopNavigation/>

            <a href="/">Home</a>
            <br></br>
            <a href="/Profile">Back to Profile</a>
            <br></br>
            <h1 className="page-title">Chats</h1>
            {conversations.map((conversation) => {
                // Find the index of the current user in the participants array
                const currentUserIndex = username !== null ? conversation.participants.indexOf(username) : -1;

                // Determine the index of the other user in the participants array
                const otherUserIndex = currentUserIndex === 0 ? 1 : 0;

                // Get the username of the other user
                const otherUsername = conversation.participants[otherUserIndex];

                return (
                    <div className="chat-list-container">
                        <div className="conversation-container" key={conversation.participants[0]}>
                            <div className = "chat-user-container">
                                <img src=" " className="profile-picture-img"></img>
                                <p className="chat-username">{otherUsername}</p>
                            </div>
                        <button onClick={() => { window.location.href = `/Chat/${otherUsername}` }}>View Chat</button>
                        </div>
                    </div>
                );
            })}


        </div>
    )
}

export default ChatList;
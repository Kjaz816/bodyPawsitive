import { useEffect, useState } from "react";
import * as api from "../apiControllers/conversationController";
import { Conversation } from "../models/conversationModel";
import "../styling/ChatList.css";
import BackButton from "../lib/icons/LeftIndicator.svg";
import TopNavigation from "../components/TopNavigation";
import ProfileExample from "../lib/icons/ProfileExample.svg";

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

    const viewChat = (otherUsername: string) => {
        if (username) {
            api.setRead(username, otherUsername)
                .then(() => {
                    window.location.href = `/Chat/${otherUsername}`;
                })
                .catch((error) => {
                    console.error(error);
                }
                );
        } else {
            window.location.href = "/Login";
        }
    }

    return (
        <div>
            <TopNavigation />
            <button onClick={() => { window.location.href = `/` }} className="left-indication">
                <img src={BackButton} className="navigation-button"></img>
                <p className="navigation-text">Back to Home</p>
            </button>

            <div className="home-page-contents-container">
                <h1 className="page-title-text" style={{marginTop: 0, marginBottom: 30}}>CHATS</h1>
                {conversations.map((conversation) => {
                    // Find the index of the current user in the participants array
                    const currentUserIndex = username !== null ? conversation.participants.indexOf(username) : -1;

                    // Determine the index of the other user in the participants array
                    const otherUserIndex = currentUserIndex === 0 ? 1 : 0;

                    // Get the username of the other user
                    const otherUsername = conversation.participants[otherUserIndex];

                    return (

                        <div key={conversation.lastMessage.content} className="chat-list-container">
                            <div className="conversation-container">
                                <div className = "chat-user-container">
                                    <div className="chat-user-photo">
                                        <img src={ProfileExample} className="profile-picture-img" style={{ width: "50px", height: "50px"}}></img>
                                    </div>
                                    <p className="chat-username">{otherUsername}</p>
                                    {conversation.lastMessage.seen === false ? <p className="chat-unseen">Unread Message</p> : <p className="chat-seen"></p>}
                                </div>
                                <button className="view-chat-button" onClick={() => { viewChat(otherUsername) }}>View Chat</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ChatList;
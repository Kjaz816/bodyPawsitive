import { useEffect, useState } from "react";
import * as api from "../apiControllers/conversationController";
import * as userApi from "../apiControllers/userController";
import { Conversation } from "../models/conversationModel";
import "../styling/ChatList.css";
import BackButton from "../lib/icons/LeftIndicator.svg";
import TopNavigation from "../components/TopNavigation";
import ProfileExample from "../lib/icons/ProfileExample.svg";

interface PictureLink {
    username: string;
    photo: string;
}

const ChatList = () => {

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [profilePictures, setProfilePictures] = useState<PictureLink[]>(
        [{
            username: "",
            photo: ""
        }]

    );
    const username = sessionStorage.getItem("loggedInUser");

    const getAllConversations = () => {
        if (username) {
          api.getConversations(username)
            .then((data) => {
              // Update the conversations state with the received data
              setConversations(data);
      
              // Iterate over the conversations to fetch profile pictures
              data.forEach((conversation: Conversation) => {
                const otherUsername = conversation.participants.find((participant) => participant !== username);
                if (otherUsername) {
                  getProfilePicture(otherUsername);
                }
              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      };
      
      const getProfilePicture = (username: string) => {
        const isDuplicate = profilePictures.some((picture) => picture.username === username);
      
        if (isDuplicate) {
          return;
        }
      
        userApi
          .getProfilePicture(username)
          .then((data) => {
            // Update the profilePictures state using a state setter function or by creating a new array
            setProfilePictures((prevPictures) => [
              ...prevPictures,
              {
                username: username,
                photo: data,
              },
            ]);
            console.log(profilePictures);
          })
          .catch((error) => {
            console.error(error);
          });
      };
      



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
                <h1 className="page-title-text" style={{ marginTop: 0, marginBottom: 30 }}>CHATS</h1>
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
                                <div className="chat-user-container">
                                    <div className="chat-user-photo">
                                        <img src={ProfileExample} className="profile-picture-img" style={{ width: "50px", height: "50px" }}></img>
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
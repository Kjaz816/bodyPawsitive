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
  const [profilePictures, setProfilePictures] = useState<PictureLink[]>([]);
  const username = sessionStorage.getItem("loggedInUser");

  const getAllConversations = () => {
    if (username) {
      api.getConversations(username)
        .then((data) => {
          // Update the conversations state with the received data
          setConversations(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const getProfilePictures = () => {
    conversations.forEach(element => {
      const otherUsername = element.participants[0] === username ? element.participants[1] : element.participants[0];
      userApi.getProfilePicture(otherUsername)
        .then((data) => {
          setProfilePictures((prev) => [...prev, { username: otherUsername, photo: data }]);
        }).catch((error) => {
          console.error(error);
        });
    });
  };

  useEffect(() => {
    getAllConversations();
  }, []);

  const [profilePicSet, setProfilePicSet] = useState(false);

  useEffect(() => {
    if (conversations.length > 0 && !profilePicSet) {
      getProfilePictures()
      setProfilePicSet(true);
    }
  }, [conversations]);

  useEffect(() => {
    if (profilePictures.length > 0) {
        console.log(profilePictures);
    }
  }, [profilePictures]);

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

          // Get the profile picture of the other user
          const otherUserPicture = profilePictures.find((element) => element.username === otherUsername)?.photo;
          return (

            <div key={conversation.lastMessage.date.toString()} className="chat-list-container">
              <div className="conversation-container">
                <div className="chat-user-container">
                  <div className="chat-user-photo">
                    <img src={otherUserPicture} style={{height:"50px", width:"50px", objectFit:"cover", borderRadius:"50%"}}/>
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

// border-radius: 50%;
// height: 40px;
// width: 40px;
// margin-left:3%; 
// object-fit: cover;

export default ChatList;
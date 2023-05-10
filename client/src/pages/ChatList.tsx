import { useEffect, useState } from "react";

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

const ChatList = () => {

    const [conversations, setConversations] = useState<ConversationBody[]>([]);
    const username = sessionStorage.getItem("loggedInUser");

    const getAllConversations = () => {
        fetch(`https://bodypositive.onrender.com//api/conversations/getConversations/${username}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setConversations(data);
            }).catch((error) => console.error(error));
    }

    useEffect(() => {
        getAllConversations();
    }, []);

    return (
        <div>
            <p>Chat List</p>
            <a href="/">Home</a>
            <br></br>
            <a href="/Profile">Back to Profile</a>
            <br></br>
            {conversations.map((conversation) => {
                // Find the index of the current user in the participants array
                const currentUserIndex = username !== null ? conversation.participants.indexOf(username) : -1;

                // Determine the index of the other user in the participants array
                const otherUserIndex = currentUserIndex === 0 ? 1 : 0;

                // Get the username of the other user
                const otherUsername = conversation.participants[otherUserIndex];

                return (
                    <div key={conversation.participants[0]}>
                        <hr />
                        <p>Chatting with: {otherUsername}</p>
                        <button onClick={() => { window.location.href = `/Chat/${otherUsername}` }}>View Chat</button>
                    </div>
                );
            })}


        </div>
    )
}

export default ChatList;
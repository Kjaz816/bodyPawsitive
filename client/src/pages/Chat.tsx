import TextField from "@mui/material/TextField";
import { useState } from "react";

const chat = () => {
    const url = window.location.href;
    const chattingWith = url.substring(url.lastIndexOf('/') + 1);

    const [chatMessage, setChatMessage] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<string[]>([]);

    const sendMessage = () => {
        const username = sessionStorage.getItem("loggedInUser");
        fetch(`/api/users/sendMessage/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chatMessage),
        })
            .then((res) => res.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => console.error(error));
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setChatMessage(() => (value));
        console.log(chatMessage)
    };

    return (
        <div>
            <a href="/Users">Back to Users</a>
            <br />
            <a href={`/Users/${chattingWith}`}>Back to {chattingWith}'s Profile</a>
            <h1>Send A Message</h1>
            <TextField
                id="chatBox"
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                onChange={handleChange}
            />
            <button >Send</button>

        </div>
    )
}

export default chat
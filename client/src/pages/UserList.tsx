import { useEffect, useState } from "react";
import { User } from "../models/userModel";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";
import * as assignApi from "../apiControllers/assignController";
import "../styling/grid.css";
import ProfileExample from "../lib/icons/ProfileExample.svg";
import "../styling/UserList.css";
import { TextField } from "@mui/material";
import BackButton from "../lib/icons/LeftIndicator.svg";

const UserList = () => {

    const currentUser = sessionStorage.getItem("loggedInUser");

    const [users, setUsers] = useState<User[]>([]);

    const getAllProfiles = () => {
        api.getAllProfiles()
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }


    useEffect(() => {
        getAllProfiles();
    }, []);

    return (
        <div>
            <TopNavigation/>
            
            <button onClick={() => { window.location.href = "/" }} className="left-indication">
                <img src={BackButton} className="navigation-button-animal"></img>
                <p className="navigation-text">Back to Home</p>
            </button>

            <div className="home-page-contents-container">
                            <h1 className="page-title-text">USERS</h1>
                            <h2 className="page-info-text">{`(` + users.length + ` USERS)`}</h2>
                            <div className="search-bar-container">
                                <TextField
                                    name="searchbar"
                                    id="searchbar"
                                    label="Search here"
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    fullWidth
                                />
                            </div>

                        </div>
            <div className="grid-container">
                <div className="grid">
            {users.map((user) => (
                <div key={user.username}>
                    {user.username !== currentUser && (
                        <div>
                            <button onClick={() => { window.location.href = `/Users/${user.username}` }} className="animal-card">
                            <div className="animal-photo-card">
                                <img id="img" src={user.photo} className="animal-photo" />
                            </div>
                            <p className="animal-name">{user.firstName} {user.lastName}</p>
                            <p className="animal-age">Username:{user.username}</p>
                            <p className="animal-age">Role: {user.permLevel}</p>
                            <p className="animal-age">Email: {user.email}</p>
                            </button>
                            <button className="send-messsage-button" onClick={() => { window.location.href = `/Chat/${user.username}` }}>Send a Message</button>

                        </div>
                    )}
                </div>
            ))}
            </div>
        </div>
        </div>

    )
}


{/* <div className="grid-container">
<div className="grid">
    {profileDetails.animals.map((animal) => (
        <div key={animal._id}>
            <button onClick={() => { window.location.href = `/Users/${username}/animals/${animal._id}` }} className="animal-card">
                <div className="animal-photo-card">
                    <img id="img" src={animal.photo} className="animal-photo" />
                </div>
                <p className="animal-name">{animal.name}</p>
                <p className="animal-age">Breed: {animal.age}</p>
                <p className="animal-breed">Age: {animal.breed}</p>
                <p className="animal-weight">Weight: {animal.weightData[0].weight} Kg</p>
            </button>
            <br />
        </div>
    ))}
</div>
</div> */}

export default UserList;
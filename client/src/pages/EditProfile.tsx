import { useContext, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import * as api from "../apiControllers/userController";
import { User } from "../models/userModel";



const EditProfile = () => {

    const [profileDetails, setProfileDetails] = useState<User>({
        username: "",
        firstName: "",
        lastName: "",
        permLevel: "volunteer",
        email: "",
        animals: [
            {
                name: "",
                species: "",
                breed: "",
                weightData: [
                    {
                        weight: 0,
                        date: new Date()
                    }

                ],
                age: 0,
                photo: "",
                details: ""
            }
        ],
    });

    const getProfile = () => {
        const username = sessionStorage.getItem("loggedInUser");
        if (username) {
            api.getProfile(username)
                .then((data) => {
                    setProfileDetails(
                        {
                            username: data.username,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            permLevel: data.permLevel,
                            email: data.email,
                            animals: data.animals
                        }
                    );
                }
                )
        } else {
            window.location.href = "/Login";
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfileDetails((prevState) => ({ ...prevState, [name]: value }));
    };

    const [updateResponse, setUpdateResponse] = useState<string>()

    const updateProfile = () => {
        const username = sessionStorage.getItem("loggedInUser");
        if (username) {
            api.updateProfile(username, profileDetails)
                .then((data) => {
                    setUpdateResponse(data.message);
                    sessionStorage.setItem("loggedInUser", profileDetails.username);
                    
                })
                .catch((error) => console.error(error));
        } else {
            window.location.href = "/Login";
        }
    }

    useEffect(() => {
        getProfile();
    }, []);



    return (
        <div >
            <br />
            <a href="/Profile">Back to Profile</a>
            <br />
            <br />
            <div>
                <TextField
                    id="changeUsername"
                    label="Username"
                    variant="outlined"
                    name="username"
                    value={profileDetails.username || ''}
                    onChange={handleChange}
                />
                <TextField
                    id="changeFirstName"
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                    value={profileDetails.firstName || ''}
                    onChange={handleChange}
                />
                <TextField
                    id="changeLastName"
                    label="Last Name"
                    variant="outlined"
                    name="lastName"
                    value={profileDetails.lastName || ''}
                    onChange={handleChange}
                />
                <TextField
                    id="changeEmail"
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={profileDetails.email || ''}
                    onChange={handleChange}
                />
                <p> {updateResponse} </p>

                <button onClick={updateProfile}>Update Profile</button>
            </div>
        </div>
    );
};

export default EditProfile;

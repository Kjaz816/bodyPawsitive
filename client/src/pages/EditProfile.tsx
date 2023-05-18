import { useContext, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import * as api from "../apiControllers/userController";
import { User } from "../models/userModel";
import TopNavigation from "../components/TopNavigation";
import BackButton from "../lib/icons/LeftIndicator.svg";

const EditProfile = () => {
    const url = window.location.href;
    const username = url.substring(url.lastIndexOf('/') + 1);

    const [profileDetails, setProfileDetails] = useState<User>({
        username: "",
        firstName: "",
        lastName: "",
        permLevel: "volunteer",
        email: "",
        photo: "",
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
                            photo: data.photo,
                            animals: data.animals
                        }
                    );
                }
                )
        } else {
            window.location.href = "/Login";
        }
    };

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "photo") {
            const file = event.target.files![0];
            const photoBase64 = await fileToBase64(file);
            const photoString = (photoBase64 as string).toString().replace(/^data:image\/[a-z]+;base64,/, "");   // remove the file type prefix
            setProfileDetails((prevState) => ({ ...prevState, [name]: photoString }));
        } else {
            setProfileDetails((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    function fileToBase64(file: any) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (e) => {
                reject(e);
            };
        });
    }

    const [updateResponse, setUpdateResponse] = useState<string>()

    const updateProfile = () => {
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
            <TopNavigation/>
            
            <br />
            <button onClick={() =>   window.history.back()} className="left-indication">
                <img src={BackButton} className="navigation-button"></img>
                <p className="navigation-text">Back</p>         
            </button>
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

                <input type="file" id="changePhoto" name="photo" accept="image/*" onChange={handleChange} />
                <p> {updateResponse} </p>

                <button onClick={updateProfile}>Update Profile</button>
            </div>
        </div>
    );
};

export default EditProfile;

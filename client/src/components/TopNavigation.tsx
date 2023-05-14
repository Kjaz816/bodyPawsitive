import { TextField } from '@mui/material';
import * as api from "../apiControllers/userController";
import { useEffect, useState } from "react";
import "../styling/TopNavigation.css" 
import TopTitle from "../lib/icons/TitleLogo.svg"
import NavigationBar from "../lib/icons/NavigationBar.svg"
import ProfileExample from "../lib/icons/ProfileExample.svg"

const TopNavigation = () => {

    interface SignUpBody {
        username: string;
        firstName: string;
        lastName: string;
        permLevel: string;
        email: string;
        animals: {
            _id: string;
            name: string;
            species: string;
            breed: string;
            weightData: {
                weight: number;
                date: Date;
            }[];
            age: number;
            photo: string;
            details: string;
        }[];
    }
    
    const [profileDetails, setProfileDetails] = useState<SignUpBody>({
        username: "",
        firstName: "",
        lastName: "",
        permLevel: "",
        email: "",
        animals: [
            {
                _id: "",
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

    const [viewPets, setViewPets] = useState<boolean>(false);


    const getProfile = () => {
        const username = sessionStorage.getItem("loggedInUser");
        if (username) {
            api.getProfile(username)
                .then((data) => {
                    setProfileDetails(data);
                }
                )
                .catch((error) => console.error(error));
        } else {
            window.location.href = "/Login";
        }
    };

    const logOut = () => {
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUserPermLevel');
        window.location.href = "/";
    }


    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className="top-navigation-container"> 
            <button onClick={logOut} className="navigation-bar">
                <img src={NavigationBar} className="navigation-bar-img"></img>
            </button>

            <button onClick={logOut} className="profile-bar">
                <img src={ProfileExample} className="profile-picture-img"></img>
                <p className="profile-name">{profileDetails.firstName} {profileDetails.lastName}</p>
            </button>

            <img src={TopTitle} className="top-title"></img>

            <button onClick={logOut} className="chat">CHAT</button>
            <button onClick={logOut} className="logout">LOGOUT</button>
        </div>

    );
}

export default TopNavigation;

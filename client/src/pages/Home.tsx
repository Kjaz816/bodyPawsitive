import TopNavigation from "../components/TopNavigation";
import "../styling/Home.css";
import "../styling/grid.css";
import SpcaGlobe from "../lib/assets/SpcaGlobe.png"
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";
import * as convApi from "../apiControllers/conversationController";
import "../styling/Profile.css";
import { SignInBody } from "../models/signInModel";
import * as assignApi from "../apiControllers/assignController";
import NextButton from "../lib/icons/RightIndicator.svg";
import { ChangeEvent } from 'react';

interface SignUpBody {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    permLevel: string;
    email: string;
    photo: string;
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

interface AssignBody {
    vet: string;
    volunteers: [{
        name: string;
        photo: string;
    }];
}

interface ConversationsBody {
    conversations: {
        _id: string;
        participants: string[];
        messages: {
            sender: string;
            content: string;
            date: Date;
            _id: string;
        }[];
        lastMessage: {
            sentBy: string;
            content: string;
            date: Date;
            seen: boolean;
        };
    }[];
}



const Home = () => {

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const loggedInUserPermLevel = sessionStorage.getItem('loggedInUserPermLevel');

    const signIn = () => {
        api.signIn(profileDetails)
            .then((data) => {
                sessionStorage.setItem("loggedInUser", data.username);
                sessionStorage.setItem("loggedInUserPermLevel", data.permLevel);
                window.location.href = "/";
            })
            .catch((error) => {
                setLoginFailedMessage("Username or password is incorrect");
                console.error(error);
            });
    };

    const [loginFailedMessage, setLoginFailedMessage] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfileDetails((prevState) => ({ ...prevState, [name]: value }));
    };

    interface volunteer {
        name: string;
        photo: string;
        _id: string;
    }

    const getAssigns = () => {
        const username = sessionStorage.getItem("loggedInUser");
        if (username) {
            assignApi.getAssigns(username)
                .then((data) => {
                    setVolunteers(data.volunteers);
                })
                .catch((error) => console.error(error));
        } else {
            window.location.href = "/Login";
        }
    };

    const [volunteers, setVolunteers] = useState<volunteer[]>([{
        name: "",
        photo: "",
        _id: ""
    }]);


    const [profileDetails, setProfileDetails] = useState<SignUpBody>({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        permLevel: "",
        email: "",
        photo: "",
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

    const [conversations, setConversations] = useState<ConversationsBody>({
        conversations: [
            {
                _id: "",
                participants: [""],
                messages: [
                    {
                        sender: "",
                        content: "",
                        date: new Date(),
                        _id: ""
                    }
                ],
                lastMessage: {
                    sentBy: "",
                    content: "",
                    date: new Date(),
                    seen: false
                }
            }
        ]
    });


    const getProfile = (userToGet: string) => {
        if (userToGet) {
            api.getProfile(userToGet)
                .then((data) => {
                    setProfileDetails(data);
                }
                )
                .catch((error) => console.error(error));
        } else {
            window.location.href = "/Login";
        }
    };

    const getChats = (userToGet: string) => {
        if (userToGet) {
            convApi.getUnreadChats(userToGet)
                .then((data) => {
                    setConversations(data);
                    if (data.length > 0) {
                        setUnseenChats(true);
                    }
                    console.log(data);
                }
                )
                .catch((error) => console.error(error));
        } else {
            window.location.href = "/Login";
        }
    };

    useEffect(() => {
        const username = sessionStorage.getItem('loggedInUser')
        if (username) {
            getChats(username);
            getProfile(username);
            if (sessionStorage.getItem('loggedInUserPermLevel') === "vet" || sessionStorage.getItem('loggedInUserPermLevel') === "vet") {
                // getAssigns();
            }
        }
        if (loggedInUserPermLevel === "vet" || loggedInUserPermLevel === "admin") {
            getAssigns();
        }


    }, []);

    const [unseenChats, setUnseenChats] = useState<boolean>(false);

    const username = sessionStorage.getItem('loggedInUser');
    // Define a state variable for the search input value
    const [searchValue, setSearchValue] = useState('');

    // Filter the volunteers array based on the search input value
    const filteredVolunteers = volunteers.filter((volunteer) =>
        volunteer.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const filteredDogs = profileDetails.animals.filter((animal) =>
        animal.name.toLowerCase().includes(searchValue.toLowerCase())
    );


    return (
        <div>
            {!loggedInUser && (

                <div className="home-initial-container">
                    <div className="home-initial-contents-container">
                        <h1 className="home-title">Body Pawsitive</h1>
                        <p className="description">A scale interfacing tool that allows you to track,<br />
                            weigh, and log details about your pet.</p>
                        <div className="log-in-navigation-container">
                            <div className="sign-in-fields" id="signUpFields">
                                <div>
                                    <TextField
                                        name="username"
                                        id="username"
                                        label="Username"
                                        variant="outlined"
                                        margin="dense"
                                        size="small"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        name="password"
                                        id="password"
                                        label="Password"
                                        variant="outlined"
                                        margin="dense"
                                        size="small"
                                        type="password"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                                <p className="login-failed-message"> {loginFailedMessage} </p>
                                <button className="login-button" onClick={signIn}>Log In</button>
                                {/* <p className="login-failed-message">login failed</p> */}
                                {/* <button className="login-button">Log In</button> */}
                            </div>
                        </div>
                    </div>
                    <div className="home-logo-image-container">
                        <img className="home-logo-image" src={SpcaGlobe} alt="logo" />
                    </div>
                </div>

            )}

            {loggedInUser && (

                <div>
                    <TopNavigation />
                    <div className="profile-info-details-container">
                        <div className="profile-image-container">
                            <img className="profile-image" src={profileDetails.photo} />
                        </div>
                        <div className="profile-details-container">
                            <h1 className="name-text">Hi, {profileDetails.firstName} {'  '} {profileDetails.lastName}</h1>
                            <p><b>Username:</b>{' '}{profileDetails.username}</p>
                            <p><b>Role:</b>{' '}{profileDetails.permLevel}</p>
                            <p><b>Email:</b>{' '}{profileDetails.email}</p>
                            {unseenChats && (
                                <div className="unseen-chat-container">
                                    <p><b>You have unread chats!</b></p>
                                    <button onClick={() => { window.location.href = `/Chat` }} className="unseen-button"> Go to Chats </button>
                                </div>
                            )}




                        </div>
                    </div>
                    {loggedInUserPermLevel === "volunteer" && (
                        <div>
                            <button onClick={() => { window.location.href = `/EditProfile/${profileDetails.username}` }} className="right-indication">
                                <img src={NextButton} className="navigation-button"></img>
                                <p className="navigation-text">Edit Profile</p>
                            </button>

                            <div className="home-page-contents-container">
                                <h1 className="page-title-text">DOGS</h1>
                                <h2 className="page-info-text">{`(` + profileDetails.animals.length + ` FURRY FRIENDS)`}</h2>
                                <div className="search-bar-container">
                                    <TextField
                                        name="searchbar"
                                        id="searchbar"
                                        label="Search here"
                                        variant="outlined"
                                        margin="dense"
                                        size="small"
                                        fullWidth
                                        value={searchValue}
                                        onChange={handleSearchInputChange}
                                    />
                                </div>
                            </div>



                            <div className="grid-container">
                                <div className="grid">
                                    {filteredDogs.map((animal) => (
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
                            </div>

                        </div>
                    )}
                    {loggedInUserPermLevel === "vet" && (
                        <div>
                            <button onClick={() => { window.location.href = `/AddUser` }} className="right-indication">
                                <img src={NextButton} className="navigation-button"></img>
                                <p className="navigation-text">Add User</p>
                            </button>
                            <button onClick={() => { window.location.href = `/AddAnimal` }} className="right-indication-left">
                                <img src={NextButton} className="navigation-button"></img>
                                <p className="navigation-text">Add Animal</p>
                            </button>
                            <button onClick={() => { window.location.href = `/EditProfile/${profileDetails.username}` }} className="right-indication-left">
                                <img src={NextButton} className="navigation-button"></img>
                                <p className="navigation-text">Edit Profile</p>
                            </button>

                            <div className="home-page-contents-container">
                                <h1 className="page-title-text">VOLUNTEERS</h1>
                                <h2 className="page-info-text">{`(` + volunteers.length + ` volunteers)`}</h2>
                                <div className="search-bar-container">
                                    <TextField
                                        name="searchbar"
                                        id="searchbar"
                                        label="Search here"
                                        variant="outlined"
                                        margin="dense"
                                        size="small"
                                        fullWidth
                                        value={searchValue}
                                        onChange={handleSearchInputChange}
                                    />
                                </div>

                            </div>


                            <div className="grid-container">
                                <div className="grid">
                                    {filteredVolunteers.map((volunteer) => (
                                        <div key={volunteer._id}>
                                            <button onClick={() => { window.location.href = `/Users/${volunteer.name}` }} className="animal-card">
                                                <div className="animal-photo-card">
                                                    <img id="img" src={volunteer.photo} className="animal-photo" />
                                                </div>
                                                <p className="animal-name">{volunteer.name}</p>
                                            </button>
                                            <br />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>)}
                </div>
            )}
        </div>
    )
}

export default Home;
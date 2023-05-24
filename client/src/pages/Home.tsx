import TopNavigation from "../components/TopNavigation";
import "../styling/Home.css";
import "../styling/grid.css";
import SpcaGlobe from "../lib/assets/SpcaGlobe.png"
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";
import "../styling/Profile.css";
import * as assignApi from "../apiControllers/assignController";
import NextButton from "../lib/icons/RightIndicator.svg";

interface SignUpBody {
    username: string;
    firstName: string;
    lastName: string;
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

const Home = () => {

    let currentUser = "Not logged In";
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const loggedInUserPermLevel = sessionStorage.getItem('loggedInUserPermLevel');

    const logOut = () => {
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUserPermLevel');
        window.location.href = "/";
    }


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

    const [viewPets, setViewPets] = useState<boolean>(false);

    const [viewAssigned, setViewAssigned] = useState<boolean>(false);


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

    useEffect(() => {
        const username = sessionStorage.getItem('loggedInUser')
        if (username) {
            getProfile(username);
            if (sessionStorage.getItem('loggedInUserPermLevel') === "vet" || sessionStorage.getItem('loggedInUserPermLevel') === "vet") {
                // getAssigns();
            }
        }
        if (loggedInUserPermLevel === "vet" || loggedInUserPermLevel === "admin") {
            getAssigns();
        }

    }, []);

    const username = sessionStorage.getItem('loggedInUser');
    const toggleViewPets = () => {
        setViewPets(!viewPets);
    }

    const toggleViewAssigned = () => {
        setViewAssigned(!viewAssigned);
    }

    
    return (
        <div>
            {!loggedInUser && (

                <div className="home-initial-container">
                    <div className="home-initial-contents-container">
                        <h1 className="home-title">Body Pawsitive</h1>
                        <p>A scale interfacing tool that allows you to track,<br />
                            weigh, and log details about your pet.</p>
                        <div className="log-in-navigation-container">
                            <a href="/SignIn"><button>Log In</button></a>
                            <br />
                            <a href="/SignUp"><button>Sign Up</button></a>
                        </div>
                    </div>
                    <div className="home-logo-image-container">
                        <img className="home-logo-image" src={SpcaGlobe} alt="logo" />
                    </div>
                </div>

            )}

            {loggedInUser && (

                    <div>
                        <TopNavigation/>
                        <div className="profile-info-details-container">
                            <div className="profile-image-container">
                                <img className="profile-image" src={profileDetails.photo}/>
                            </div>
                            <div className="profile-details-container">
                                <h1 className="name-text">Hi, {profileDetails.firstName} {'  '} {profileDetails.lastName}</h1>
                                <p><b>Username:</b>{' '}{profileDetails.username}</p>
                                <p><b>Role:</b>{' '}{profileDetails.permLevel}</p>
                                <p><b>Email:</b>{' '}{profileDetails.email}</p>
                            </div>
                        </div>
                        {loggedInUserPermLevel === "volunteer" && (
                            <div>
                        <button onClick={() => { window.location.href = `/EditProfile/${profileDetails.username}` }} className="right-indication">
                                            <img src={NextButton} className="navigation-button"></img>
                                            <p className="navigation-text">Edit User</p>
                        </button>

                            <div className="home-page-contents-container">
                            <h1 className="page-title-text">DOGS</h1>
                            <h2 className="page-info-text">{`(8 FURRY FRIENDS )`}</h2>
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
                                            <p className="navigation-text">Edit User</p>
                        </button>

                            <div className="home-page-contents-container">
                            <h1 className="page-title-text">VOLUNTEERS</h1>
                            <h2 className="page-info-text">{`(8 volunteers )`}</h2>
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
                                {volunteers.map((volunteer) =>
                                    <div key={volunteer._id}>
                                        <button onClick={() => { window.location.href = `/Users/${volunteer.name}` }} className="animal-card">
                                        <div className="animal-photo-card">
                                                        <img id="img" src={volunteer.photo} className="animal-photo" />
                                                    </div>

                                        <p className="animal-name">{volunteer.name}</p>
                                            
                                        </button>
                                        <br />
                                    </div>)}
                                    </div>
                                </div>

                                </div>) }



                </div>
            )}
        </div>
    )
}

export default Home;
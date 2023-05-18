import TopNavigation from "../components/TopNavigation";
import "../styling/Home.css";
import "../styling/grid.css";
import SpcaGlobe from "../lib/assets/SpcaGlobe.svg"
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";
import "../styling/Profile.css";
import * as assignApi from "../apiControllers/assignController";

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
    if (loggedInUser) {
        console.log(loggedInUserPermLevel)
    }

    const logOut = () => {
        sessionStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUserPermLevel');
        window.location.href = "/";
    }

    
        const [assignBody, setAssignBody] = useState<AssignBody>({
            vet: "",
            volunteers: [{
                name: "",
                photo: ""
            }]
        })
    
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
            if (username){
            getProfile(username);
            if (sessionStorage.getItem('loggedInUserPermLevel') === "vet" || sessionStorage.getItem('loggedInUserPermLevel') === "vet"  ){
                // getAssigns();
            }
        }
            
        }, []);
    
        const toggleViewPets = () => {
            setViewPets(!viewPets);
        }
    
    return (
        <div className="page-container-home">

            {!loggedInUser && (

                <div className = "home-initial-container">
                    <div className = "home-initial-contents-container">
                        <h1 className = "home-title">Body Pawsitive</h1>
                        <p>A scale interfacing tool that allows you to track,<br />
                            weigh, and log details about your pet.</p>
                        <div className = "log-in-navigation-container">
                            <a href="/SignIn"><button>Log In</button></a>
                            <br />
                            <a href="/SignUp"><button>Sign Up</button></a>
                        </div>
                    </div>
                    <div className = "home-logo-image-container">
                        <img className = "home-logo-image" src={SpcaGlobe} alt="logo" />
                    </div>
                </div>

            )}

            {loggedInUser && (
                
                <div className = "home-page-container">
                    <TopNavigation/>

                    <div className = "profile-info-container" id="profileInfo">
                        <div className="profile-image-container">
                            {/* <img src={profileDetails.photo} alt="Profile Picture" /> */}
                        <img className="profile-details-image" src={SpcaGlobe} alt="Profile Picture" />
                        </div>
                        <div className="profile-details-container">
                            <h1 className="name-text">{profileDetails.firstName} {'  '} {profileDetails.lastName}</h1>
                            <p><b>Username:</b>{' '}{profileDetails.username}</p>
                            <p><b>Role:</b>{' '}{profileDetails.permLevel}</p>
                            <p><b>Email:</b>{' '}{profileDetails.email}</p>
                        </div>
                    </div>

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

                        <div className="grid-container">
                            <div className="grid">
                        </div>
                        </div>

                    </div>

                    {loggedInUserPermLevel === "admin" || loggedInUserPermLevel === "vet" && (
                        <div>
                            <a href = "/AddUser">Add User</a>
                            <br />
                            <a href="/AddAnimal">Add Animal</a>
                        </div>)}
                </div>
            )}
        </div>
    )
}

export default Home;
import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";
import * as assignApi from "../apiControllers/assignController";
import TopNavigation from "../components/TopNavigation";
import "../styling/grid.css";
import { TextField } from "@mui/material";
import BackButton from "../lib/icons/LeftIndicator.svg";
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

interface AssignBody{
    name: string,
    photo: string
}
const OtherUserProfile = () => {

    const url = window.location.href;
    const username = url.substring(url.lastIndexOf('/') + 1);

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

    const [assigns, setAssigns] = useState<AssignBody[]>([
        {
            name: "",
            photo: ""
        }
    ]);

    const [viewAssigns, setViewAssigns] = useState<boolean>(false);
    const [viewPets, setViewPets] = useState<boolean>(false);


    const getProfile = () => {
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
            })
            .catch((error) => console.error(error));
    };

    const getAssigns = () => {
        assignApi.getAssigns(username)
            .then((data) => {
                if (!data) {
                    return;
                }
                console.log(data);
                setAssigns(data.volunteers);
            })
            .catch((error) => console.error(error));
    };




    useEffect(() => {
        getProfile();
        getAssigns();
        console.log("assigns", assigns)
    }, []);

    const toggleViewPets = () => {
        setViewPets(!viewPets);
    }

    const toggleViewAssigns = () => {
        setViewAssigns(!viewAssigns);
    }


    return (

        <div className="page-container">
            <TopNavigation />

                    <div>
                        <div className="profile-info-details-container">
                            <div className="profile-image-container">
                                <img className="profile-image" src={profileDetails.photo}/>
                            </div>
                            <div className="profile-details-container">
                                <h1 className="name-text">{profileDetails.firstName} {'  '} {profileDetails.lastName}</h1>
                                <p><b>Username:</b>{' '}{profileDetails.username}</p>
                                <p><b>Role:</b>{' '}{profileDetails.permLevel}</p>
                                <p><b>Email:</b>{' '}{profileDetails.email}</p>
                            </div>
                        </div>
                        {profileDetails.permLevel === "volunteer" && (
                            <div>
                        <button onClick={() => { window.location.href = `/EditProfile/${profileDetails.username}` }} className="right-indication">
                                            <img src={NextButton} className="navigation-button"></img>
                                            <p className="navigation-text">Edit User</p>
                        </button>

                            <div className="home-page-contents-container">
                            <h1 className="page-title-text">DOGS</h1>
                            <h2 className="page-info-text">{`(` + profileDetails.animals.length + ` FURRY FRIENDS )`}</h2>
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
                        {profileDetails.permLevel === "vet" && (
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
                            <h2 className="page-info-text">{`(` + assigns.length + ` volunteers )`}</h2>
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
                                {assigns.map((assign) =>
                                    <div>
                                        <button onClick={() => { window.location.href = `/Users/${assign.name}` }} className="animal-card">
                                        <div className="animal-photo-card">
                                                        <img id="img" src={assign.photo} className="animal-photo" />
                                                    </div>

                                        <p className="animal-name">{assign.name}</p>
                                            
                                        </button>
                                        <br />
                                    </div>)}
                                    </div>
                                </div>

                                </div>) }



                </div>
        </div>
    )
}


export default OtherUserProfile;
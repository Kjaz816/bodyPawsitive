import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";
import "../styling/grid.css";
import ProfileExample from "../lib/icons/ProfileExample.svg";

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

const OtherUserProfile = () => {

    const url = window.location.href;
    const username = url.substring(url.lastIndexOf('/') + 1);

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
            })
            .catch((error) => console.error(error));
    };


    useEffect(() => {
        getProfile();
    }, []);

    const toggleViewPets = () => {
        setViewPets(!viewPets);
    }


    return (

        <div className="page-container">
            <TopNavigation/>

            <a href="/Users">Back to Users</a>
            <div id="profileInfo">
                <h1>Profile</h1>
                <b>Username: </b> <p>{profileDetails.username}</p>
                <b>First Name: </b> <p>{profileDetails.firstName}</p>
                <b>Last Name: </b> <p>{profileDetails.lastName}</p>
                <b>Permission Level: </b> <p>{profileDetails.permLevel}</p>
                <b>Email: </b> <p>{profileDetails.email}</p>
            </div>
            <button onClick={() => { toggleViewPets() }}>View Pets</button>
            <button onClick={() => { window.location.href = `/Chat/${profileDetails.username}` }}>Send a Message</button>
            {sessionStorage.getItem("loggedInUserPermLevel") === "admin" || sessionStorage.getItem("loggedInUserPermLevel") === "vet" && profileDetails.permLevel !== "admin" && (
                <button onClick={() => { window.location.href = `/EditProfile/${username}` }}>Edit Profile</button>
            )}
            {viewPets && (
                <div>
                    <h1>Pets</h1>

                    <div className="grid-container">
                        <div className="grid">
                            {profileDetails.animals.map((animal) => (
                                <div key={animal._id}>
                                    <button onClick={() => { window.location.href = `/Users/${username}/animals/${animal._id}` }} className="animal-card">
                                        <div className="animal-photo-card">
                                            <img id="img" src={animal.photo} className="animal-photo"/>
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
        </div>
    )
}
export default OtherUserProfile;
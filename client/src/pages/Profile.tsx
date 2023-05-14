import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";

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

const Profile = () => {

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


    useEffect(() => {
        getProfile();
    }, []);

    const toggleViewPets = () => {
        setViewPets(!viewPets);
    }

    return (

        <div>
            <a href="/">Home</a>
            <div id="profileInfo">
                <h1>Profile</h1>
                <b>Username: </b> <p>{profileDetails.username}</p>
                <b>First Name: </b> <p>{profileDetails.firstName}</p>
                <b>Last Name: </b> <p>{profileDetails.lastName}</p>
                <b>Role: </b> <p>{profileDetails.permLevel}</p>
                <b>Email: </b> <p>{profileDetails.email}</p>
            </div>
            <button onClick={() => { window.location.href = `/EditProfile/${profileDetails.username}` }}>Edit Profile</button>

            {profileDetails.permLevel === "admin" || profileDetails.permLevel === "vet" && ( // Only show the Add Animal button if the user is an admin
                <button onClick={() => { window.location.href = "/AddAnimal" }}>Add Animal</button>
            )}

            <button onClick={() => { toggleViewPets() }}>View Pets</button>
            {viewPets && (
                <div>
                    <h1>Pets</h1>
                    {profileDetails.animals.map((animal) => (
                        <div key={animal._id}>
                            <p>{animal.name}</p>
                            <a href={`/AnimalDetails/${animal._id}`}>Animal Details</a>
                            <br />
                            <a href={'/ViewWeight/' + animal._id}>View and add Weight</a>
                            <br />
                            {profileDetails.permLevel === "admin" || profileDetails.permLevel === "vet" && ( // Only show the Edit Animal button if the user is an admin}
                                <a href={`/EditAnimal/${animal._id}`}>Edit Animal</a>
                            )}
                            <br />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Profile;
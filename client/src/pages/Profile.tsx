import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";
import SpcaGlobe from "../lib/assets/SpcaGlobe.svg";
import "../styling/Profile.css";
import "../styling/grid.css"
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


interface volunteer {
    name: string;
    photo: string;
    _id: string;
}

const Profile = () => {

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

    useEffect(() => {
        const username = sessionStorage.getItem('loggedInUser')
        if (username){
        getProfile(username);
        if (sessionStorage.getItem('loggedInUserPermLevel') === "vet" || sessionStorage.getItem('loggedInUserPermLevel') === "vet"  ){
            getAssigns();
        }
    }
        
    }, []);

    useEffect(() => {
        console.log(volunteers);
    }, [volunteers]);

    const toggleViewPets = () => {
        setViewPets(!viewPets);
    }

    return (

        <div className="full-page-container">
            {/* <TopNavigation />  */}

            <div className="user-option-bar">
                <a className="back" href="/">{'<- '}Back</a>
                <button className="edit-profile-button" onClick={() => { window.location.href = `/EditProfile/${profileDetails.username}` }}>{'-> '}Edit Profile</button>
            </div>
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

            <hr />

            
            <div className="grid-container">
                        <div className="grid">
                            {profileDetails.animals.map((animal) => (
                                <div key={animal._id}>
                                        <div className="animal-photo-card">
                                            <img id="img" src={animal.photo} className="animal-photo"/>
                                        </div>
                                        <p className="animal-name">{animal.name}</p>
                                        <p className="animal-age">Breed: {animal.age}</p>
                                        <p className="animal-breed">Age: {animal.breed}</p>
                                        <p className="animal-weight">Weight: {animal.weightData[0].weight} Kg</p>
                                    <br />
                                </div>
                            ))}
                        </div>
                    </div>

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
import { useEffect, useState } from "react";

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

const UserProfile = () => {

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
        fetch(`/api/users/getProfile/${username}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setProfileDetails(
                    {
                        username: data.username,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        permLevel: data.permLevel,
                        email: data.email,
                        animals: data.animals,
                    }
                );
            }).catch((error) => console.error(error));
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
                <b>Permission Level: </b> <p>{profileDetails.permLevel}</p>
                <b>Email: </b> <p>{profileDetails.email}</p>
            </div>
            <button onClick={() => { toggleViewPets() }}>View Pets</button>
            {viewPets && (
                <div>
                    <h1>Pets</h1>
                    {profileDetails.animals.map((animal) => (
                        <div key={animal._id}>
                            <p>{animal.name}</p>
                            <a href={`/Users/${username}/animals/${animal._id}`}>Animal Details</a>
                            <br />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default UserProfile;
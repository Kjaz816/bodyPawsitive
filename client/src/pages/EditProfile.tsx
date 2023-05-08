import { useContext, useEffect, useState } from "react";
import { TextField } from "@mui/material";


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

const EditProfile = () => {

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

    const getProfile = () => {
        const username = sessionStorage.getItem("loggedInUser");
        fetch(`http://localhost:4000/api/users/getProfile/${username}`, {
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfileDetails((prevState) => ({ ...prevState, [name]: value }));
    };

    const [updateResponse, setUpdateResponse] = useState<string>()

    const updateProfile = () => {
        const username = sessionStorage.getItem("loggedInUser");
        const url = `http://localhost:4000/api/users/updateProfile/${username}`;
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profileDetails),
        })
            .then((res) => res.json())
            .then((data) => {
                sessionStorage.setItem("loggedInUser", profileDetails.username);
                console.log(data)
                setUpdateResponse(data.message)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getProfile();
    }, []);



    return (
        <div >
            <br />
            <a href="/Profile">Back to Profile</a>
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
                    name="Email"
                    value={profileDetails.email || ''}
                    onChange={handleChange}
                />
                <p> {updateResponse} </p>

                <button onClick={updateProfile}>Update Profile</button>
            </div>
        </div>
    );
};

export default EditProfile;

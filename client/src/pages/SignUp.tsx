import { useState, useEffect } from "react";
import { TextField } from '@mui/material';
import * as api from "../apiControllers/userController";
import { User } from "../models/userModel"


const SignUp = () => {
    const [signUpError, setSignUpError] = useState("");

    const addUser = () => {
        api.createUser(profileDetails)
            .then((data) => {
                console.log(data);
                sessionStorage.setItem("loggedInUser", profileDetails.username);
                sessionStorage.setItem("loggedInUserPermLevel", profileDetails.permLevel);
                window.location.href = "/";
            })
            .catch((error) => {
                setSignUpError("Username already exists");
                console.error(error);
            });
    };

    const [profileDetails, setProfileDetails] = useState<User>({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        permLevel: "volunteer",
        email: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfileDetails((prevState) => ({ ...prevState, [name]: value }));
    };


    useEffect(() => {
    }, []);

    return (
        <div>
            <a href="/">Home</a>
            <p>Sign Up</p>
            <div id="signUpFields">
                <TextField
                    name="username"
                    id="username"
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    name="firstName"
                    id="firstName"
                    label="First Name"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    name="lastName"
                    id="lastName"
                    label="Last Name"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    name="password"
                    id="password"
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    name="email"
                    id="email"
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />

                <button onClick={addUser}>Add User</button>
                {signUpError && <p> {signUpError} </p>}
            </div>
        </div>

    );
}

export default SignUp;

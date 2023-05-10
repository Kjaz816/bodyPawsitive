import { useState, useEffect } from "react";
import { TextField } from '@mui/material';

interface SignUpBody {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    permLevel: string;
    email: string;
}

const SignUp = () => {
    const [signUpError, setSignUpError] = useState("");

    const addUser = () => {
        //fetch("https://bodypositive.onrender.com/api/users/signUp", {
        fetch("https://bodypositive.onrender.com/api/users/signUp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profileDetails),
        })
            .then((res) => {
                if (res.status === 400) {
                    setSignUpError("Username already exists");
                    return Promise.reject("Username already exists");
                }
                return res.json();
            })
            .then(() => {
                sessionStorage.setItem("loggedInUser", profileDetails.username);
                window.location.href = "/";
            })
            .catch((error) => console.error(error));
    };

    const [profileDetails, setProfileDetails] = useState<SignUpBody>({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        permLevel: "user",
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

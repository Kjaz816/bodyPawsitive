import { useState, useEffect } from "react";
import { TextField } from '@mui/material';
import * as api from "../apiControllers/userController";
import { SignInBody } from "../models/signInModel"


const SignIn = () => {
    const signIn = () => {
        api.signIn(profileDetails)
            .then((data) => {
                console.log(data);
                sessionStorage.setItem("loggedInUser", data.username);
                sessionStorage.setItem("loggedInUserPermLevel", data.permLevel);
                window.location.href = "/";
            })
            .catch((error) => {
                setLoginFailedMessage("Username or password is incorrect");
                console.error(error);
            });
    };

    const [profileDetails, setProfileDetails] = useState<SignInBody>({
        username: "",
        password: "",
    });

    const [loginFailedMessage, setLoginFailedMessage] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfileDetails((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <div>
            <a href="/">Home</a>
            <p>Sign In</p>
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
                name="password"
                id="password"
                label="Password"
                variant="outlined"
                margin="normal"
                required
                onChange={handleChange}
            />
            <button onClick={signIn}>Sign In</button>
            </div>
            <p> {loginFailedMessage} </p>
        </div>

    );
}

export default SignIn;

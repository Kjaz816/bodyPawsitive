import { useState, useEffect } from "react";
import { TextField } from '@mui/material';
import * as api from "../apiControllers/userController";
// import "../styling/SignIn.css";
import { SignInBody } from "../models/signInModel";
import loginLogo from "../lib/assets/loginlogo.png";
import titleLogo from "../lib/icons/TitleLogo.svg";



const SignIn = () => {
    const signIn = () => {
        api.signIn(profileDetails)
            .then((data) => {
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
        <div className = "page-container-signin">
            <div className = "sign-in-fields" id="signUpFields"> 
                <img className= "login-logo-image" src={loginLogo} alt="logo" />
                <a href="/"><img className= "login-logo-image" src={titleLogo} alt="logo" /></a>
                <p className="login-failed-message"> {loginFailedMessage} </p>
                <div>
                    <TextField
                        name="username"
                        id="username"
                        label="Username"
                        variant="outlined"
                        margin="dense"
                        size="small"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <TextField
                        name="password"
                        id="password"
                        label="Password"
                        variant="outlined"
                        margin="dense"
                        size="small"
                        required
                        onChange={handleChange}
                    />
                </div>
                <button onClick={signIn}>Log In</button>
            </div>
        </div>

    );
}

export default SignIn;

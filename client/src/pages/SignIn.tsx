import { useState, useEffect } from "react";
import { TextField } from '@mui/material';

interface SignInBody {
    username: string;
    password: string;

}

const SignIn = () => {
    const [message, setMessage] = useState("");
    const checkConn = () => {
        fetch("/")
            .then((res) => res.json())
            .then((data) => setMessage(data.message));
    };
    const addUser = () => {
        fetch("https://bodypositive.onrender.com/api/users/signIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profileDetails),
        })
            .then((res) => {
                if (res.status === 400) {
                    setLoginFailed("Username or password is incorrect");
                    return Promise.reject("Username or password is incorrect");
                }
                return res.json()
            })
            .then(() => {
                sessionStorage.setItem("loggedInUser", profileDetails.username);
                window.location.href = "/";
            })
            .catch((error) => console.error(error));
    };
    const [profileDetails, setProfileDetails] = useState<SignInBody>({
        username: "",
        password: "",
    });
    const [loginFailed, setLoginFailed] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfileDetails((prevState) => ({ ...prevState, [name]: value }));
    };
    useEffect(() => {
        checkConn();
    }, []);

    return (
        <div>
            <a href="/">Home</a>
            <p> {message} </p>
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
            <button onClick={addUser}>Sign In</button>
            </div>
            <p> {loginFailed} </p>
        </div>

    );
}

export default SignIn;

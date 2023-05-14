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
        photo: "",
    });

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "photo") {
            const file = event.target.files![0];
            const photoBase64 = await fileToBase64(file);
            const photoString = (photoBase64 as string).toString().replace(/^data:image\/[a-z]+;base64,/, "");   // remove the file type prefix
            setProfileDetails((prevState) => ({ ...prevState, [name]: photoString }));
        } else {
            setProfileDetails((prevState) => ({ ...prevState, [name]: value }));
        }
        console.log(profileDetails)
    };

    function fileToBase64(file: any) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (e) => {
                reject(e);
            };
        });
    }

    const [previewPicture, setPreviewPicture] = useState<string>("");


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
                <input
                    type="file"
                    id="profile"
                    name="photo"
                    accept="image/png, image/jpeg"
                    onChange={(event) => {
                        if (!event.target.files) return;
                        const file = event.target.files[0];
                        setPreviewPicture(URL.createObjectURL(file));
                        handleChange(event);
                    }}
                />

                <br />
                <div id="preview"></div>
            </div>


            <button onClick={addUser}>Add User</button>
            {previewPicture && <img src={previewPicture} alt="Profile Image" className="previewImage" style={{ maxWidth: "500px", maxHeight: "500px" }} />}
            {signUpError && <p> {signUpError} </p>}
        </div>


    );
}

export default SignUp;

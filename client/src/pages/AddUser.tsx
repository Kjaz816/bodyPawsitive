import { useState, useEffect } from "react";
import { TextField, MenuItem } from '@mui/material';
import * as api from "../apiControllers/userController";
import { User } from "../models/userModel"


const AddUser = () => {
    const [addUserError, setAddUserError] = useState("");
    const [volunteers, setVolunteers] = useState<User[]>([]);

    const addUser = () => {
        api.createUser(profileDetails, assignTo)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                setAddUserError("Username already exists");
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

    const [assignTo, setAssignTo] = useState<string>("");

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "assignTo") {
            setAssignTo(value);
            return
        }
        if (name === "photo") {
            const file = event.target.files![0];
            const photoBase64 = await fileToBase64(file);
            const photoString = (photoBase64 as string).toString().replace(/^data:image\/[a-z]+;base64,/, "");   // remove the file type prefix
            setProfileDetails((prevState) => ({ ...prevState, [name]: photoString }));
            return
        }
        setProfileDetails((prevState) => ({ ...prevState, [name]: value }));

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

    function getVets() {
        api.getAllProfiles()
            .then((data) => {
                const vets: User[] = [];
                for (const element of data) {
                    if (element.permLevel === "vet") {
                        vets.push(element);
                    }
                }
                setVolunteers(vets);
            })
    }

    useEffect(() => {
        getVets();
    }, []);

    const [previewPicture, setPreviewPicture] = useState<string>("");

    return (
        <div>
            <a href="/">Home</a>
            <p>Add User</p>
            <div id="addUserFields">
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
                <TextField
                    select
                    name="permLevel"
                    id="permLevel"
                    defaultValue={"volunteer"}
                    label="Permission Level"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                >
                    <MenuItem value="volunteer">Volunteer</MenuItem>
                    <MenuItem value="vet">Vet</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </TextField>
                <TextField
                    select
                    name="assignTo"
                    id="assignTo"
                    label="Assign To"
                    variant="outlined"
                    margin="normal"
                    required
                    defaultValue=''
                    onChange={handleChange}
                >
                    {volunteers.map((volunteer) => (
                        <MenuItem key={volunteer.username} value={volunteer.username}>{volunteer.firstName} {volunteer.lastName}</MenuItem>
                    ))}
                </TextField>

                <br />
                <div id="preview"></div>
            </div>


            <button onClick={addUser}>Add User</button>
            {previewPicture && <img src={previewPicture} alt="Profile Image" className="previewImage" style={{ maxWidth: "500px", maxHeight: "500px" }} />}
            {addUserError && <p> {addUserError} </p>}
        </div>


    );
}

export default AddUser;

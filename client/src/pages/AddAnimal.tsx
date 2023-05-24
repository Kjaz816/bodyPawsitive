import { TextField } from "@mui/material";
import { useState } from "react";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";
import BackButton from "../lib/icons/LeftIndicator.svg";

interface AddAnimalBody {
    name: string;
    species: string;
    breed: string;
    weight: number;
    age: number;
    details: string;
    photo: string;
}


const AddAnimal = () => {

    const [animalDetails, setAnimalDetails] = useState<AddAnimalBody>({
        name: "",
        species: "",
        breed: "",
        weight: 0,
        age: 0,
        details: "",
        photo: ""
    });

    const [userToAssign, setUserToAssign] = useState<string>("");

    const addAnimal = () => {
        const username = userToAssign
        api.addAnimal(username, animalDetails)
            .then((data) => {
                window.location.href = `/Users/${username}/animals/${data._id}`;
            }
            )

    }

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "weight" || name === "age") {
            setAnimalDetails((prevState) => ({ ...prevState, [name]: parseInt(value) }));
            return;
        }

        if (name === "user") {
            setUserToAssign(value);
            return;
        }

        if (name === "photo") {
            const file = event.target.files![0];
            const photoBase64 = await fileToBase64(file);
            const photoString = (photoBase64 as string).toString().replace(/^data:image\/[a-z]+;base64,/, "");   // remove the file type prefix
            setAnimalDetails((prevState) => ({ ...prevState, [name]: photoString }));
            setPreviewPicture(URL.createObjectURL(file));
            return;
        } 
            

        setAnimalDetails((prevState) => ({ ...prevState, [name]: value }));
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

    return (
        <div>

            <TopNavigation/>

            <button onClick={() =>   { window.location.href = `/` }} className="left-indication">
                <img src={BackButton} className="navigation-button"></img>
                <p className="navigation-text">Back</p>         
            </button>
            <h2 className="add-edit-titles" style={{marginTop: 20, marginBottom: 30}}>Add Animal</h2>
            <div className="add-animal-columns" id="signUpFields">
                <TextField
                    style={{margin:15}}
                    name="name"
                    id="name"
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    style={{margin:15}}
                    name="species"
                    id="species"
                    label="Species"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    style={{margin:15}}
                    name="breed"
                    id="breed"
                    label="Breed"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    style={{margin:15}}
                    name="weight"
                    id="weight"
                    type="number"
                    label="weight"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    style={{margin:15}}
                    name="age"
                    id="age"
                    type="number"
                    label="Age"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    style={{margin:15}}
                    name="details"
                    id="details"
                    label="Details"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />

                <TextField
                style={{margin:15}}
                name="user"
                id="user"
                label="Assign to"
                variant="outlined"
                margin="normal"
                required
                onChange={handleChange}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop:40, marginBottom:20 }}>
                <input className="input-style" type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop:20, marginBottom:20 }}>
                {previewPicture && <img src={previewPicture} alt="Profile Image" className="previewImage" style={{ maxWidth: "300px", maxHeight: "300px" }} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button style={{ marginBottom: 20 }} className="edit-profile-button" onClick={addAnimal}>Add Animal</button>
            </div>
        </div>
    )
}

export default AddAnimal;
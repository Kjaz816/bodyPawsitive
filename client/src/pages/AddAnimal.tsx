import { TextField } from "@mui/material";
import { useState } from "react";
import * as api from "../apiControllers/userController";

interface AddAnimalBody {
    name: string;
    species: string;
    breed: string;
    weight: number;
    age: number;
    details: string;
}


const AddAnimal = () => {

    const [animalDetails, setAnimalDetails] = useState<AddAnimalBody>({
        name: "",
        species: "",
        breed: "",
        weight: 0,
        age: 0,
        details: "",
    });

    const [userToAssign, setUserToAssign] = useState<string>("");

    const addAnimal = () => {
        const username = userToAssign
        api.addAnimal(username, animalDetails)
            .then((data) => {
                console.log(data)
                window.location.href = `/Users/${username}/animals/${data._id}`;
            }
            )

    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === "weight" || name === "age") {
            setAnimalDetails((prevState) => ({ ...prevState, [name]: parseInt(value) }));
            return;
        }
        console.log (name, value)
        if (name === "user") {
            setUserToAssign(value);
            return;
        }

        setAnimalDetails((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <div>
            <a href="/">Home</a>
            <p>Add Animal</p>
            <div id="signUpFields">
                <TextField
                    name="name"
                    id="name"
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    name="species"
                    id="species"
                    label="Species"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    name="breed"
                    id="breed"
                    label="Breed"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
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
                    name="details"
                    id="details"
                    label="Details"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
            </div>
            <TextField
                name="user"
                id="user"
                label="Assign to"
                variant="outlined"
                margin="normal"
                required
                onChange={handleChange}
            />
                
            <button onClick={addAnimal}>Add Animal</button>
        </div>
    )
}

export default AddAnimal;
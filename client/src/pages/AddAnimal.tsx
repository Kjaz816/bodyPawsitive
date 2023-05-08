import { TextField } from "@mui/material";
import { useState } from "react";

interface AddAnimalBody {
    name: string;
    species: string;
    breed: string;
    weight: string;
    age: string;
    details: string;
}


const AddAnimal = () => {

    const [animalDetails, setAnimalDetails] = useState<AddAnimalBody>({
        name: "",
        species: "",
        breed: "",
        weight: "",
        age: "",
        details: "",
    });

    const addAnimal = () => {
        const username = sessionStorage.getItem("loggedInUser"); 
        fetch(`http://localhost:4000/api/users/addAnimal/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(animalDetails),
        })
            .then((res) => {
                if (res.status === 400) {
                    return Promise.reject("Animal already exists");
                }
                return res.json()
            })
            .then(() => {
                window.location.reload();
            })
            .catch((error) => console.error(error));
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
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
                    label="weight"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    name="age"
                    id="age"
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
                <button onClick={addAnimal}>Add Animal</button>
            </div>
        </div>
    )
}

export default AddAnimal;
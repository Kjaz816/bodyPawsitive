import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

const EditAnimal = () => {

    interface AnimalDetailsBody {
        _id: string;
        name: string;
        species: string;
        breed: string;
        weightData: [{
            id: string;
            weight: number;
            date: Date;
        }];
        age: number;
        photo: string;
        details: string;
    }

    const [animalDetails, setAnimalDetails] = useState<AnimalDetailsBody>({
        _id: "",
        name: "",
        species: "",
        breed: "",
        weightData: [
            {
                id: "",
                weight: 0,
                date: new Date()
            }
        ],
        age: 0,
        photo: "",
        details: ""
    });

    const url = window.location.href;
    const animalId = url.substring(url.lastIndexOf('/') + 1);
    const username = sessionStorage.getItem("loggedInUser");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAnimalDetails((prevState) => ({ ...prevState, [name]: value }));
    };

    const getAnimalDetails = () => {
        fetch(`https://bodypositive.onrender.com/api/users/getAnimalDetails/${username}/animals/${animalId}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setAnimalDetails(
                    {
                        _id: data._id,
                        name: data.name,
                        species: data.species,
                        breed: data.breed,
                        weightData: data.weightData,
                        age: data.age,
                        photo: "photo",
                        details: data.details
                    }
                    
                );
            }).catch((error) => console.error(error));
    }

    const [viewWeights, setViewWeights] = useState<boolean>(false);

    useEffect(() => {
        getAnimalDetails();
    }, []);

    const updateAnimal = () => {
        fetch(`https://bodypositive.onrender.com/api/users/updateAnimal/${username}/animals/${animalId}`, {
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
            })
            .catch((error) => console.error(error));
    }


    return (
        <div>
            <a href="/Profile">Back to Profile</a>
            <p>Edit Animal</p>
            <div id="editAnimalFields">
                <TextField
                    name="name"
                    id="name"
                    label="Name"
                    variant="outlined"
                    value={animalDetails.name}
                    onChange={handleChange}
                />
                <TextField
                    name="species"
                    id="species"
                    label="Species"
                    variant="outlined"
                    value={animalDetails.species}
                    onChange={handleChange}
                />
                <TextField
                    name="breed"
                    id="breed"
                    label="Breed"
                    variant="outlined"
                    value={animalDetails.breed}
                    onChange={handleChange}
                />
                <TextField
                    name="age"
                    id="age"
                    label="Age"
                    variant="outlined"
                    value={animalDetails.age}
                    onChange={handleChange}
                />
                <TextField
                    name="photo"
                    id="photo"
                    label="Photo"
                    variant="outlined"
                    value={animalDetails.photo}
                    onChange={handleChange}
                />
                <TextField
                    name="details"
                    id="details"
                    label="Details"
                    variant="outlined"
                    value={animalDetails.details}
                    onChange={handleChange}
                />
                <button onClick={updateAnimal}>Edit Animal</button>
                <button onClick={() => setViewWeights(!viewWeights)}>View Weights</button>
                {viewWeights && (
                    <div>
                        {animalDetails.weightData.map((weight) => (
                            <div key={weight.id}>
                                <p>Weight: {weight.weight}</p>
                                <p>Date: {
                                    new Date(weight.date).toLocaleDateString("en-NZ", {
                                        timeZone: "Pacific/Auckland",
                                        hour12: true,
                                        hour: 'numeric',
                                        minute: 'numeric',
                                    })
                                }</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>


    )
}
export default EditAnimal;
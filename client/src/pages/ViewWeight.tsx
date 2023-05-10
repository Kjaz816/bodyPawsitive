import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface AnimalDetailsBody {
    _id: string;
    name: string;
    species: string;
    breed: string;
    weightData: Array<{
        _id?: string;
        weight: number;
        date: Date;
    }>;
    age: number;
    photo: string;
    details: string;
}



const ViewWeight = () => {

    const username = sessionStorage.getItem("loggedInUser");
    const url = window.location.href;
    const animalId = url.substring(url.lastIndexOf('/') + 1);

    const [animalDetails, setAnimalDetails] = useState<AnimalDetailsBody>({
        _id: "",
        name: "",
        species: "",
        breed: "",
        weightData: [
            {
                weight: 0,
                date: new Date()
            }
        ],
        age: 0,
        photo: "",
        details: ""
    });

    const [weight, setWeight] = useState<number>(0);

    const updatedAnimalDetails = {
        ...animalDetails,
        weightData: [
            ...animalDetails.weightData,
            {
                weight: weight,
                date: new Date().toISOString()
            }
        ]
    }

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
                        photo: data.photo,
                        details: data.details
                    }
                );
            })
            .catch((error) => console.error(error));
    }

    const AddWeight = () => {
        console.log(updatedAnimalDetails);
        fetch(`https://bodypositive.onrender.com/api/users/addAnimalWeight/${username}/animals/${animalId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                weight: weight,
            }),
        })
            .then((res) => {
                if (res.status === 400) {
                    return Promise.reject("Weight already exists");
                }
                return res.json()
            })
            .then(() => {
                window.location.reload();
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        getAnimalDetails();
    }, []);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        console.log(value);
        setWeight(value as unknown as number);
        console.log(updatedAnimalDetails)
        
    };
    //
    return (
        <div>
            <a href="/Profile">Back to Profile</a>
            <p>Weight History of </p> {animalDetails.name}
            <h3>Weight Data: </h3>
            <hr></hr> {animalDetails.weightData.map((weightData) => {
                const date = new Date(weightData.date);
                const formattedDate = date.toLocaleDateString("en-NZ", {
                    timeZone: "Pacific/Auckland",
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                });
                const formattedTime = date.toLocaleTimeString("en-NZ", {
                    timeZone: "Pacific/Auckland",
                    hour12: true,
                    hour: 'numeric',
                    minute: 'numeric',
                });
                return (
                    
                    <div key={weightData.date.toString()}>
                        <p>Weight: {weightData.weight}</p>
                        <p>Date: {formattedDate} at {formattedTime}</p>
                        <hr></hr>
                    </div>
                )
            })}

            <div id="addWeightFields">
                <TextField
                    name="weight"
                    type="number"
                    id="weight"
                    label="Weight"
                    variant="outlined"
                    margin="normal"
                    required
                    onChange={handleChange}
                />
            </div>
            <button onClick={AddWeight}>Add Weight</button>
        </div>
    );
}

export default ViewWeight;
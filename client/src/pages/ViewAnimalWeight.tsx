import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";

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

const ViewAnimalWeight = () => {

    const url = window.location.href;
    const username = url.substring(url.indexOf("ViewWeight/") + 11, url.indexOf("/", url.indexOf("ViewWeight/") + 11));  
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

    const getAnimalDetails = () => {
        if (username) {
            api.getAnimalDetails(username, animalId)
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
                }
                )
        } else {
            window.location.href = "/Login";
        }
    }

    const AddWeight = () => {
        if (username) {
            api.addAnimalWeight(username, animalId, weight)
                .then(() => {
                    window.location.reload();
                }
                )
        }
    }

    useEffect(() => {
        getAnimalDetails();
    }, []);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setWeight(parseInt(value));

    };
    //
    return (
        <div>

            <TopNavigation/>
            
            <a href = {"/Users/" + username + "/animals/" + animalId}>Back to Animal Details</a>
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

export default ViewAnimalWeight;
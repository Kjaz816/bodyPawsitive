import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";

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
    const username = url.substring(url.lastIndexOf('/EditAnimal/') + 12, url.indexOf('/', url.lastIndexOf('/EditAnimal/') + 13));

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "photo") {
            if (name === "photo") {
                const file = event.target.files![0];
                const photoBase64 = await fileToBase64(file);
                const photoString = (photoBase64 as string).toString().replace(/^data:image\/[a-z]+;base64,/, "");   // remove the file type prefix
                setAnimalDetails((prevState) => ({ ...prevState, [name]: photoString }));
                return;
            }
            setAnimalDetails((prevState) => ({ ...prevState, [name]: value }));
        };
    }

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

    const getAnimalDetails = () => {
        if (username) {
            api.getAnimalDetails(username, animalId)
                .then((data) => {
                    setAnimalDetails(data);
                })
        } else {
            window.location.href = "/Login";
        }

    }

    const [viewWeights, setViewWeights] = useState<boolean>(false);

    const updateAnimal = () => {
        if (username) {
            api.updateAnimal(username, animalId, animalDetails)
                .then(() => {
                    //window.location.reload();
                }).catch((err) => {
                    console.error(err);
                })
        } else {
            window.location.href = "/Login";
        }
    }

    useEffect(() => {
        getAnimalDetails();
    }, []);


    return (
        <div>
            <a href={`/Users/${username}`}>Back to {username}'s Profile</a>
            <br />
            <a href={`/Users/${username}/animals/${animalId}`}>Back to Animal</a>
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
                    name="details"
                    id="details"
                    label="Details"
                    variant="outlined"
                    value={animalDetails.details}
                    onChange={handleChange}
                />

                <input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} />

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
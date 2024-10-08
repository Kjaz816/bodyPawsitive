import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";
import BackButton from "../lib/icons/LeftIndicator.svg";

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
                setPreviewPicture(URL.createObjectURL(file));
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

    const [previewPicture, setPreviewPicture] = useState<string>("");

    return (
        <div>
            <TopNavigation/>
            
            <button onClick={() =>   { window.location.href = `/Users/${username}/animals/${animalId}` }} className="left-indication">
                <img src={BackButton} className="navigation-button"></img>
                <p className="navigation-text">Back</p>         
            </button>
            <h2 className="add-edit-titles" style={{marginTop: 0, marginBottom: 5, fontSize:40}}>Edit Animal Details</h2>

            <div className="edit-details-center" id="editAnimalFields">
                <TextField
                    style={{margin:15}}
                    name="name"
                    id="name"
                    label="Name"
                    variant="outlined"
                    value={animalDetails.name}
                    onChange={handleChange}
                />
                <TextField
                    style={{margin:15}}
                    name="species"
                    id="species"
                    label="Species"
                    variant="outlined"
                    value={animalDetails.species}
                    onChange={handleChange}
                />
                <TextField
                    style={{margin:15}}
                    name="breed"
                    id="breed"
                    label="Breed"
                    variant="outlined"
                    value={animalDetails.breed}
                    onChange={handleChange}
                />
                <TextField
                    style={{margin:15}}
                    name="age"
                    id="age"
                    label="Age"
                    variant="outlined"
                    value={animalDetails.age}
                    onChange={handleChange}
                />
                <TextField
                    style={{margin:15}}
                    name="details"
                    id="details"
                    label="Details"
                    variant="outlined"
                    value={animalDetails.details}
                    onChange={handleChange}
                />

                <br />
                <input className="input-style" type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} />
                {previewPicture && <img src={previewPicture} alt="Profile Image" className="previewImage" style={{ maxWidth: "300px", maxHeight: "300px", marginTop:20, marginBottom:20 }} />}

                <button className="edit-profile-button" onClick={updateAnimal}>Save</button>

            </div>
        </div>


    )

}
export default EditAnimal;
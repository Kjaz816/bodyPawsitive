import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";
import "../styling/ViewAnimalWeight.css";
import BackButton from "../lib/icons/LeftIndicator.svg";
import "../styling/AnimalDetails.css"
import Scale from "../lib/assets/ScaleLong.png";

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

interface Weightbody {
    weight: number;
    date: Date;
    status: string;

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
    const [display, setDisplay] = useState<string>("Start Weighing");

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

    const [DefaultWeightState, setDefaultWeightState] = useState<boolean>(true);
    const [weightSucceeded, setWeightSucceeded] = useState<boolean>(false);
    const [fetchFinished, setFetchFinished] = useState<boolean>(false);
    const [sleepState, setSleepState] = useState<boolean>(false);

    async function handleBeginWeighing() {
        let counter = 0;
        setFetchFinished(false)
        setDisplay("Press Tare Button To Start")
        setDefaultWeightState(false)
        await api.setDefaultWeight();

        const interval = setInterval(async () => {

            const response = await api.getUploadedWeight() as Weightbody;
            console.log(response.status)
            counter++;
            setDefaultWeightState(false)
            if (response.status === 'start') {
                setDisplay("Weighing....");
                setSleepState(false)
            }
            else if(response.status === 'sleep'){
                setSleepState(true)
                setDisplay("The Pico is Sleeping");
            }
            else if (response.status === 'stable') {
                setDisplay(response.weight + " Kg")
                setWeight(response.weight)
                setWeightSucceeded(true)
                setFetchFinished(true)
            }

            if (counter === 500 || response.status === 'stable') {
                clearInterval(interval);
                console.log('Finished weighing');
                if (response.status != 'stable') {
                    setDisplay("No weight detected");
                    setFetchFinished(true)
                    setWeightSucceeded(false)

                }
            }
        }, 500);

        setTimeout(() => {
            clearInterval(interval);
            console.log('Finished weighing');
        }, 100000);
    }


    return (
        <div className="view-animal-weight-container">
            <TopNavigation />


            <button onClick={() => { window.location.href = "/Users/" + username + "/animals/" + animalId }} className="left-indication">
                <img src={BackButton} className="navigation-button-animal"></img>
                <p className="navigation-text">Back to {animalDetails.name}'s details</p>
            </button>

            <div className="weigh-animal-page-container">
                <div className="weight-data-container">
                    <div className="weight-data-values">
                        <h3 className="weight-data-title">Weight History </h3>
                        <p className="weight-and-date-title">
                            <span className="weight-data-weight">Weight</span>
                            <span className="weight-data-date">Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </p>
                        {animalDetails.weightData
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((weightData) => {
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
                                        <p className="weight-and-date">
                                            <span className="weight-data-weight">{weightData.weight} Kg</span>
                                            <span className="weight-data-date"> {formattedDate} at {formattedTime}</span>
                                        </p>
                                    </div>
                                )
                            })}
                    </div>
                </div>
                <div className="weigh-scale-container">
                    <div className="weighing-scale-text-container">
                        <div className="scale-title">
                            <p>Weigh Your Pet</p>
                        </div>
                        <div className="scale-caption">
                            <p>Weight</p>
                        </div>
                        <div className="scale-start-weighing">
                            <p id="start-weighing-text">{display}</p>
                        </div>
                        {DefaultWeightState && (

                        <div className="scale-start-button-container">
                            <button onClick={handleBeginWeighing} className="scale-start-button">
                                Begin
                            </button>
                        </div>

                        )}
                        <div className="scale-instructions">
                            {!sleepState && !fetchFinished && (
                            <p>
                                To start weighing your pet, press the Begin button above. Then, press
                                the button on the Pico before you place your pet on the scale.
                            </p>
                            )}

                            {sleepState && (
                            <p>
                                The Pico is currently sleeping. Tare to start weighing. 
                            </p>
                            )}

                            {fetchFinished && (
                                <div>
                                    <p>
                                        Choose your action from the below button/s
                                    </p>
                                    {weightSucceeded && (
                                        <button onClick={AddWeight} className="scale-start-button" > Send Weight </button>
                                    )}
                                    <button onClick={handleBeginWeighing} className="scale-start-button" > Weigh again </button>


                                </div>
                            )}

                        </div>
                    </div>
                    <img src={Scale} className="scale" alt="Weighing Scale" />
                </div>
            </div>

            {/* <div id="addWeightFields">
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
            <button onClick={AddWeight}>Add Weight</button> */}
        </div>
    );
}

export default ViewAnimalWeight;
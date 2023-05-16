import { useState, useEffect } from "react";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";
import "../styling/AnimalDetails.css";
import BackButton from "../lib/icons/LeftIndicator.svg"
import NextButton from "../lib/icons/RightIndicator.svg"
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const OtherUserAnimalDetails = () => {

    interface AnimalDetailsBody {
        _id: string;
        name: string;
        species: string;
        breed: string;
        weightData: {
            weight: number;
            date: Date;
        }[];
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
                weight: 0,
                date: new Date()
            }
        ],
        age: 0,
        photo: "",
        details: ""
    });

    const currentUrl = window.location.href;
    const animalId = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    const username = currentUrl.substring(currentUrl.lastIndexOf('/Users/') + 7, currentUrl.indexOf('/animals'));


    const getAnimalDetails = () => {
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
    }
    useEffect(() => {
        getAnimalDetails();
    }, []);

    
    interface AnimalWeightData {
        weight: number;
        date: string;
      }
      
    
    const [animalWeightData, setAnimalWeightData] = useState<AnimalWeightData>({
        weight: 0,
        date: "",
    });


    // useEffect(() => {
    //     const fetchData = async () => {
    //         const animalData = await fetchAnimalWeight(username, animalId);

    //         setAnimalWeightData(animalWeightData);
    //     };
    //     fetchData();
    // }, []);

    const chartData = {
        datasets: [
          {
            data: [animalWeightData.weight], // Access the weight property directly
            label: 'Animal Weight',
            borderColor: 'rgba(0, 0, 255, 0.5)',
            fill: false,
          },
        ],
        labels: [animalWeightData.date], // Access the date property directly
      };
            
    const loggedInUserPermLevel = sessionStorage.getItem("loggedInUserPermLevel");

    console.log("chart data", chartData);

    return (
        <div className="page-container-animal-details">
            <TopNavigation/>
            
            <button onClick={() => { window.location.href = `/Users/${username}` }} className="left-indication">
                <img src={BackButton} className="navigation-button"></img>
                <p className="navigation-text">Back</p>         
            </button>

            <div className="animal-details-container">
                
                <div className="animal-detials-photo-container">
                    <img className="animal-details-photo" src={`${animalDetails.photo}`} alt="Animal" />
                </div>

                <div className="animal-details-info">
                    <p className="animal-details-name">{animalDetails.name}</p>   
                    <p><span className="caption-bold">Breed:</span> <span className="details-text">{animalDetails.breed}</span></p>
                    <p><span className="caption-bold">Age:</span> <span className="details-text">{animalDetails.age}</span></p>
                    <p><span className="caption-bold">Details:</span> <span className="details-text">{animalDetails.details}</span></p>
                    {animalDetails.weightData.map((weightData) => {
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
                                    <p><span className="caption-bold">Weight:</span> <span className="details-text"> {weightData.weight} Kg</span></p>
                                    <p><span className="caption-bold">Last Weighed:</span> <span className="details-text"> {formattedDate} at {formattedTime}</span></p>
                                </div>
                            )
                        })}

                    {(loggedInUserPermLevel === "admin" || loggedInUserPermLevel === "vet") &&
                                    <div>
                                        <button onClick={() => { `/EditAnimal/${username}/${animalDetails._id}` }} className="right-indication">
                                            <img src={NextButton} className="navigation-button"></img>
                                            <p className="navigation-text">Edit Animal</p>
                                        </button>

                                        <button onClick={() => {`/ViewWeight/${username}/${animalDetails._id}` }} className="right-indication">
                                            <img src={NextButton} className="navigation-button"></img>
                                            <p className="navigation-text">Add Weight Data</p>
                                        </button>
                                    </div>  
                                }
                    
                </div>  

            </div>
        </div>
    );
}

export default OtherUserAnimalDetails;
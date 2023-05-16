import { useState, useEffect } from "react";
import * as api from "../apiControllers/userController";
import TopNavigation from "../components/TopNavigation";
import "../styling/AnimalDetails.css";
import BackButton from "../lib/icons/LeftIndicator.svg"
import NextButton from "../lib/icons/RightIndicator.svg"
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { getAnimalWeights } from "../apiControllers/userController"; 
import { CategoryScale } from 'chart.js';

const AnimalDetails = () => {

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
      
      
    
    const [animalWeightData, setAnimalWeightData] = useState<AnimalWeightData[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            const animalData = await getAnimalWeights(username, animalId);
            
            setAnimalWeightData(animalData);
        };
        fetchData();
    }, []);

    Chart.register(CategoryScale);


    const options = {
        responsive: true,
        maintainAspectRatio: false,
      };    

      const data = {
        labels: animalWeightData.map((weight) => {
          const date = new Date(weight.date);
          const formattedDate = date.toLocaleDateString("en-NZ", {
            timeZone: "Pacific/Auckland",
            year: 'numeric',
            month: 'numeric',   
            day: 'numeric',
          });
          return formattedDate;
        }),
        datasets: [
          {
            label: 'Animal Weight',
            data: animalWeightData.map((weight) => weight.weight),
            borderColor:  '#1D7AC4',
            backgroundColor:'rgba(29, 122, 196, 0.2)',
            fill: false,
          },
        ],
      };
      
            
    const loggedInUserPermLevel = sessionStorage.getItem("loggedInUserPermLevel");

    console.log("weight data", animalWeightData);

    let formattedDate = '';
    let formattedTime = '';

    const lastWeighedData = animalDetails.weightData[animalDetails.weightData.length - 1];

    if (lastWeighedData) {
    const date = new Date(lastWeighedData.date);
    formattedDate = date.toLocaleDateString("en-NZ", {
        timeZone: "Pacific/Auckland",
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    formattedTime = date.toLocaleTimeString("en-NZ", {
        timeZone: "Pacific/Auckland",
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
    });
    }


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
                    <p><span className="caption-bold">Weight:</span> <span className="details-text">{lastWeighedData.weight} Kg</span></p>
                    <p><span className="caption-bold">Last Weighed:</span> <span className="details-text">{formattedDate} at {formattedTime}</span></p>
                    
                    {(loggedInUserPermLevel === "admin" || loggedInUserPermLevel === "vet") &&
                                    <div className="next-buttons">
                                        <button onClick={() => { window.location.href = `/EditAnimal/${username}/${animalDetails._id}` }} className="right-indication">
                                            <img src={NextButton} className="navigation-button"></img>
                                            <p className="navigation-text">Edit Animal</p>
                                        </button>

                                        <button onClick={() => {`/ViewWeight/${username}/${animalDetails._id}` }} className="right-indication">
                                            <img src={NextButton} className="navigation-button"></img>
                                            <p className="navigation-text">Add Weight Data</p>
                                        </button>
                                    </div>  
                                }
                    <div className="chart-container">
                        <Line data={data} className="chart"  options={options}></Line>
                    </div>
                </div>  

            </div>
        </div>
    );
}

export default AnimalDetails;
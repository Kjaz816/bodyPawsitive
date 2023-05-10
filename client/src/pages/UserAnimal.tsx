import { useState, useEffect } from "react";

const UserAnimal = () => {

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


    const getAnimalDetails = () => {
        const currentUrl = window.location.href;
        const animalId = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
        const username = currentUrl.substring(currentUrl.lastIndexOf('/Users/') + 7, currentUrl.indexOf('/animals'));
        const url = `/api/users/getAnimalDetails/${username}/animals/${animalId}`
        fetch(url, {
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
    useEffect(() => {
        getAnimalDetails();
    }, []);



    return (
        <div>
            <a href="/Profile">Back to Profile</a>
            <h1>Animal Details</h1>
            <p>Name: {animalDetails.name}</p>
            <p>Species: {animalDetails.species}</p>
            <p>Breed: {animalDetails.breed}</p>
            <p>Age: {animalDetails.age}</p>
            <p>Details: {animalDetails.details}</p>
            <h3>Weight Data: </h3> {animalDetails.weightData.map((weightData) => {
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
                    </div>
                )
            })}
        </div>
    );
}

export default UserAnimal;
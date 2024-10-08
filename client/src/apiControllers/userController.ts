import { User } from "../models/userModel";
import { SignInBody } from "../models/signInModel";

const deployed = true;

const url = deployed ? "https://bodypositive.onrender.com" : "";

// Api calls to backend

export const createUser = async (user: User, assignedTo: string) => {
    const response = await fetch(url + `/api/users/AddUser/${assignedTo}`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    const data = await response.json();
    return data;
}

export const signIn = async (signIn: SignInBody) => {
    const response = await fetch(url + "/api/users/signIn", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(signIn)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const data = await response.json();
    return data;
}

export const getAllProfiles = async () => {
    const response = await fetch(url + "/api/users/getAllProfiles", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}

export const getProfile = async (username: string) => {
    const response = await fetch(url + "/api/users/getProfile/" + username, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    return data;
}   

export const getAnimalDetails = async (username: string, animalId: string) => {
    const response = getProfile(username);
    const data = await response;
    const animal = data.animals.find((animal: { _id: string; }) => animal._id === animalId);
    return animal;
}

export const getAnimalWeights = async (username: string, animalId: string) => {
    const response = getAnimalDetails(username, animalId);
    const data = await response;
    const weights = data.weightData;
    return weights;
}

export const updateProfile = async (username: string, user: User) => {
    const response = await fetch(url + "/api/users/updateProfile/" + username, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    const data = await response.json();
    return data;
}

export const addAnimal = async (username: string, animal: {
    name: string;
    species: string;
    breed: string;
    age: number;
    weight: number;
    photo: string;
}) => {
    const response = await fetch(url + "/api/users/addAnimal/" + username, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(animal)
    });

    const data = await response.json();
    const animalObj = data.animals[data.animals.length - 1];
    return animalObj;
}

export const updateAnimal = async (
    username: string,
    animalId: string,
    animal: {
        name: string;
        species: string;
        breed: string;
        age: number;
        photo: string;
        weightData: {
            id: string;
            weight: number;
            date: Date;
        }[];
    }
) => {
    const response = await fetch(url + "/api/users/updateAnimal/" + username + "/animals/" + animalId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(animal)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const data = await response.json();
    return data;
}

export const addAnimalWeight = async (username: string, animalId: string, weight: number) => {
    const response = await fetch(url + "/api/users/addAnimalWeight/" + username + "/animals/" + animalId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ weight: weight })
    });
    const data = await response.json();
    return data;
}

export const setDefaultWeight = async () => {
    await fetch(url + "/api/users/postWeight", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ weight: 0, status: "default" })
    });
}

export const getUploadedWeight = async() => {
    console.log("getUploadedWeight")
    const response = await fetch(url + "/api/users/getUploadedWeight", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}

export const getProfilePicture = async (username: string) => {
    const response = await fetch(url + "/api/users/getProfilePicture/" + username, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}
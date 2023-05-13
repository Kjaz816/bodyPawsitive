export interface Animal {
    id?: string;
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

export interface User {
    username: string;
    firstName: string;
    lastName: string;
    password?: string;
    permLevel: "volunteer" | "vet" | "admin";
    email: string;
    animals?: Animal[];
}
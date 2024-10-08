import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
import AssignModel from "../models/assignModel";
import WeightModel from "../models/weightModel";
import { RequestHandler } from "express";
import { ObjectId } from "mongodb";

interface UserDetails {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    permLevel: string;
    email: string;
    photo: string;
}

interface SignInBody {
    username: string;
    password: string;
}

interface AddAnimalBody {
    name: string;
    species: string;
    breed: string;
    weight: number;
    age: number;
    photo: string;
    details: string;
}

const uploadToImgur = async (photo: string) => {
    const base64 = photo;
    try {
        const formData = new FormData();
        formData.append("image", base64);
        const response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: 'Client-ID fb2fd5b710efd8c'
            },
            body: formData
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const data = await response.json();
        return data.data.link;
    } catch (error) {
        console.error(error);
    }
}



export const addUser: RequestHandler<{ assignedTo: string }, unknown, UserDetails, unknown> = async (req, res) => {
    const { username, firstName, lastName, password, permLevel, email, photo } = req.body;
    const assignedTo = req.params.assignedTo;
    try {
        const existingUser = await UserModel.findOne({ username }).exec();
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await UserModel.create({
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword,
            permLevel: permLevel,
            email: email,
            photo: await uploadToImgur(photo),
            animals: []
        }).catch(error => {
            console.error(error);
            return res.status(500).json({ message: error });
        });
        const assignExisting = await AssignModel.findOne({ vet: assignedTo }).exec();
        if (assignExisting) {
            console.log(username, photo)
            assignExisting.volunteers.push({
                name: username,
                photo: await uploadToImgur(photo)
            });
            await assignExisting.save();
            return res.status(201).json({ newUser });
        } else {
            const newAssign = await AssignModel.create({
                vet: assignedTo,
                volunteers: [{
                    name: username,
                    photo: await uploadToImgur(photo)
                }
                ]
            }).catch(error => {
                console.error(error);
                return res.status(500).json({ message: "Assign Error: " + error });
            });
            res.status(201).json({ newUser });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}

export const signIn: RequestHandler<unknown, unknown, SignInBody, unknown> = async (req, res) => {
    const { username, password } = req.body;
    try {
        const User = await UserModel.findOne({ username }).exec();
        if (!User) {
            return res.status(400).json({ message: "User does not exist!" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, User.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        res.status(200).json(User);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const addAnimal: RequestHandler<{ username: string }, unknown, AddAnimalBody, unknown> = async (req, res) => {
    const username = req.params.username;
    const { name, species, breed, weight, age, photo, details } = req.body;
    try {
        const User = await UserModel.findOne({ username }).exec();
        if (!User) {
            return res.status(400).json({ message: "User does not exist!" });
        }
        const newAnimal = {
            name: name,
            species: species,
            breed: breed,
            weightData: [{
                weight: weight,
                date: new Date()
            }],
            age: age,
            photo: await uploadToImgur(photo),
            details: details
        }
        const Update = await UserModel.findOneAndUpdate({ username }, { $push: { animals: newAnimal } }, { new: true }).exec();
        res.status(200).json(Update);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getProfile: RequestHandler<{ username: string }, unknown, unknown, unknown> = async (req, res) => {
    const username = req.params.username;
    try {
        const User = await UserModel.findOne({ username }).select({ password: 0 }).exec();
        if (!User) {
            return res.status(400).json({ message: "User does not exist!" });
        }
        res.status(200).json(User);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getAllProfiles: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res) => {
    try {
        const Users = await UserModel.find().select({ password: 0 }).exec();
        if (!Users) {
            return res.status(400).json({ message: "No users exist!" });
        }
        res.status(200).json(Users);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const updateProfile: RequestHandler<{ username: string }, unknown, UserDetails, unknown> = async (req, res) => {
    const oldUsername = req.params.username;
    const { username, firstName, lastName, permLevel, email, photo } = req.body;
    try {
        const User = await UserModel.findOne({ username: oldUsername }).exec();
        if (!User) {
            return res.status(400).json({ message: "User does not exist!" });
        }
        const Update = await UserModel.findOneAndUpdate({ username: oldUsername }, {
            username: username,
            firstName: firstName,
            lastName: lastName,
            permLevel: permLevel,
            email: email,
            photo: await uploadToImgur(photo)
        }, { new: true }).exec()
        res.status(200).json({
            message: "Profile updated successfully",
            data: Update
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getAnimalDetails: RequestHandler<{ username: string, animalId: string }, unknown, unknown, unknown> = async (req, res) => {
    const { username, animalId } = req.params;
    const formatId = new ObjectId(animalId)
    try {
        const user = await UserModel.findOne({ username }).exec();
        if (!user) {
            return res.status(400).json({ message: "User does not exist!" });
        }

        const animal = user.animals.id(formatId);
        if (!animal) {
            return res.status(400).json({ message: "Animal does not exist!" });
        }
        res.status(200).json(animal);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getAnimalWeights: RequestHandler<{ username: string, animalId: string }, unknown, unknown, unknown> = async (req, res) => {
    const { username, animalId } = req.params;
    const formatId = new ObjectId(animalId)
    try {
        const user = await UserModel.findOne({ username }).exec();
        if (!user) {
            return res.status(400).json({ message: "User does not exist!" });
        }

        const animal = user.animals.id(formatId);
        if (!animal) {
            return res.status(400).json({ message: "Animal does not exist!" });
        }
        res.status(200).json(animal.weightData);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}


export const updateAnimal: RequestHandler<{ username: string, animalId: string }, unknown, AddAnimalBody, unknown> = async (req, res) => {
    const { username, animalId } = req.params;
    const { name, species, breed, weight, age, photo, details } = req.body;
    const formatId = new ObjectId(animalId);
    try {
        const updatedAnimal = await UserModel.findOneAndUpdate(
            { username: username, "animals._id": formatId },
            {
                $set: {
                    "animals.$.name": name,
                    "animals.$.species": species,
                    "animals.$.breed": breed,
                    "animals.$.age": age,
                    "animals.$.weightData": weight,
                    "animals.$.photo": await uploadToImgur(photo),
                    "animals.$.details": details,
                },
            },
            { new: true }
        ).exec();

        if (!updatedAnimal) {
            return res.status(400).json({ message: "Animal does not exist!" });
        }

        res.status(200).json(updatedAnimal);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const addAnimalWeight: RequestHandler<{ username: string, animalId: string }, unknown, { weight: number }, unknown> = async (req, res) => {
    const { username, animalId } = req.params;
    const { weight } = req.body;
    const formatId = new ObjectId(animalId);
    try {
        const updatedAnimal = await UserModel.findOneAndUpdate(
            { username: username, "animals._id": formatId },
            {
                $push: {
                    "animals.$.weightData": {
                        weight: weight,
                        date: new Date()
                    }
                }
            },
            { new: true }
        ).exec();

        if (!updatedAnimal) {
            return res.status(400).json({ message: "Animal does not exist!" });
        }

        res.status(200).json(updatedAnimal);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const uploadWeight: RequestHandler<unknown, unknown, { weight: number, status: string }, unknown> = async (req, res) => {
    const { weight, status } = req.body;
    try {
        const updatedWeight = await WeightModel.findOneAndUpdate({}, { weight, status, date: new Date() }, { upsert: true, new: true });
        res.status(200).json(updatedWeight);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
};

export const getUploadedWeight: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res) => {
    try {
        const weights = await WeightModel.findOne().exec();
        res.status(200).json(weights);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getProfilePicture: RequestHandler<{ username: string }, unknown, unknown, unknown> = async (req, res) => {
    const username = req.params.username;
    try {
        const User = await UserModel.findOne({ username }).select({ password: 0 }).exec();
        if (!User) {
            return res.status(400).json({ message: "User does not exist!" });
        }
        res.status(200).json(User.photo);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}
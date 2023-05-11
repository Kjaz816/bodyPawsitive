import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
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

export const signUp: RequestHandler<unknown, unknown, UserDetails, unknown> = async (req, res) => {
    const { username, firstName, lastName, password, permLevel, email } = req.body;
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
            animals: []
        }).catch(error => {
            console.error(error);
            return res.status(500).json({ message: error });
        });
        res.status(201).json({ newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
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
        res.status(200).json({ User });
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
            photo: photo,
            details: details
        }
        const Update = await UserModel.findOneAndUpdate({ username }, { $push: { animals: newAnimal } }, { new: true }).exec();
        res.status(200).json({ Update });
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
    const { username, firstName, lastName, permLevel, email } = req.body;
    try {
        const User = await UserModel.findOne({ username: oldUsername }).exec();
        if (!User) {
            return res.status(400).json({ message: "User does not exist!" });
        }
        const Update = await UserModel.findOneAndUpdate({ username: oldUsername }, { username, firstName, lastName, permLevel, email }, { new: true }).exec()
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

export const updateAnimal: RequestHandler<{ username: string, animalId: string }, unknown, AddAnimalBody, unknown> = async (req, res) => {
    const { username, animalId } = req.params;
    const { name, species, breed, weight, age, photo, details } = req.body;
    console.log(weight)
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
                    "animals.$.photo": photo,
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
        res.status(500).json({ message: "Something went wrong!" });
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

export const addWeight: RequestHandler<unknown, unknown, { weight: number }, unknown> = async (req, res) => {
    const { weight } = req.body;
    try {
        const updatedWeight = await WeightModel.create({ weight: weight, date: new Date() });
        res.status(200).json(updatedWeight);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    }
}
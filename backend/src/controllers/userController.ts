import bcrypt from "bcryptjs";
import UserModel from "../models/userModel";
import { RequestHandler } from "express";

interface SignUpBody {
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

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res) => {
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

export const signIn: RequestHandler<unknown, unknown, SignInBody, unknown>  = async (req, res) => {
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

export const getProfile: RequestHandler = async (req, res) => {
    //
}
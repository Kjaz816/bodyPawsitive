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




export const signUp:  RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res) => {
    const { username, firstName, lastName, password, permLevel, email } = req.body;
    try {
        const existingUser = UserModel.findOne({ email }).exec();
        if (await existingUser) {
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
		});
        res.status(201).json({ newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong!" }); 
    }
}

export const getProfile: RequestHandler = async (req, res) => {
    //
}
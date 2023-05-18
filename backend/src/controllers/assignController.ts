import { RequestHandler } from "express";
import AssignModel from "../models/assignModel";

interface AssignBody {
    vet: string;
    volunteer: string;
}

export const assign: RequestHandler<unknown, unknown, AssignBody, unknown> = async (req, res, next) => {
    const { vet, volunteer } = req.body;
    if (!vet || !volunteer) {
        return res.status(400).json({ message: "Missing required fields!" });
    }
    try {
        let assign = await AssignModel.findOne({ vet });
        if (assign) {
            if (assign.volunteers.includes(volunteer)) {
                return res.status(200).json({ message: "Already Assigned." });
            }
            assign.volunteers.push(volunteer);
        } else {
            assign = await AssignModel.create({
                vet: vet,
                volunteers: [volunteer]
            });
        }
        await assign.save();
        return res.status(200).json({ assign });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};


export const getAssigns: RequestHandler<{username: string}, unknown, unknown, unknown> = async (req, res, next) => {
    const vet = req.params.username;
    try {
        const assign = await AssignModel.findOne({ vet: vet }).exec();
        return res.status(200).json( assign );
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};
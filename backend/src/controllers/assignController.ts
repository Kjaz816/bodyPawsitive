import { RequestHandler } from "express";
import AssignModel from "../models/assignModel";

interface AssignBody {
    vet: string;
    volunteer: string;
}

const assign: RequestHandler<unknown, unknown, AssignBody, unknown> = async (req, res, next) => {
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


const getAssign: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res, next) => {
    try {
        const assign = await AssignModel.find().exec();
        return res.status(200).json({ assign });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};
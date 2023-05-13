import { InferSchemaType, model, Schema } from "mongoose";

const animalSchema = new Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    weightData: [{
        weight: { type: Number, required: true },
        date: { type: Date, required: true }
    }],
    age: { type: Number, required: true },
    photo: { type: String, required: true },
    details: { type: String, required: true }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    permLevel: {
        type: String,
        required: true,
        enum: ["volunteer", "vet", "admin"],
    },
    email: {
        type: String,
        required: true,
    },
    animals: [animalSchema],
});

type User = InferSchemaType<typeof userSchema>;
export default model<User>("User", userSchema, "Users");
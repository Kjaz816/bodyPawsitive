import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20
    },
    permLevel: { 
        type: String,
        required: true,
        enum: ["user", "vet", "admin"],
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    animals: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        species: { type: String, required: true },
        breed: { type: String, required: true },
        weight: { type: Number, required: true },
        age: { type: Number, required: true },
        photo: { type: String, required: true },
        details: { type: String, required: true }
    }],
});
    
type User = InferSchemaType<typeof userSchema>;
export default model<User>("User", userSchema);
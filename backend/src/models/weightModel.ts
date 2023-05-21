import { InferSchemaType, model, Schema } from "mongoose";

const weightSchema = new Schema({
    weight: { type: Number, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true }
});

type Weight = InferSchemaType<typeof weightSchema>;
export default model<Weight>("Weight", weightSchema, "Weights");
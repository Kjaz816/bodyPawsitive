import { InferSchemaType, model, Schema } from "mongoose";

const assignSchema = new Schema({
    vet: {
        type: String,
        required: true,
    },
    volunteers: [
        {
            name: { type: String, required: true },
            photo: { type: String, required: true },
        }
    ],
});

type Assign = InferSchemaType<typeof assignSchema>;
export default model<Assign>("Assign", assignSchema, "Assigns");

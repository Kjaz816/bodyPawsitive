import { InferSchemaType, model, Schema } from "mongoose";

const assignSchema = new Schema({
    vet: {
        type: String,
        required: true,
    },
    volunteers: [{
        type: String,
        required: true,
    }],
});

type Assign = InferSchemaType<typeof assignSchema>;
export default model<Assign>("Assign", assignSchema, "Assigns");

import { InferSchemaType, model, Schema } from "mongoose";

const conversationSchema = new Schema({
    participants: [{
        type: String,
        required: true,
    }],
    messages: [{
        sender: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        }
    }],
    lastMessage: {
        sentBy: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        seen: {
            type: Boolean,
            required: true,
        }
    }
});

type Conversation = InferSchemaType<typeof conversationSchema>;
export default model<Conversation>("Conversation", conversationSchema, "Conversations");


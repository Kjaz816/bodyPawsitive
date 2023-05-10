import { InferSchemaType, model, Schema } from "mongoose";

const conversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        required: true,
    }],
    messages: [{
        sender: {
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
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


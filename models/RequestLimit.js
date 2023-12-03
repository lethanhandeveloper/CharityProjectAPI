import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('RequestLimit',
    new Schema({
        id: { type: ObjectId },
        route: {
            type: String,
            required: true
        },
        clientIp: {
            type: String,
            required: true
        },
        nextRequestAt: {
            type: Number,
            required: true
        }
    })
)
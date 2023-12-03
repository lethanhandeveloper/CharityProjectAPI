import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('EmailRegistrationCode', 
    new Schema({
        id: {type: ObjectId},
        email: {
            type: String,
            required: true
        },
        rgCode: {
            type: String,
            required: true
        },
        expiredAt: {
            type: Number,
            required: true
        }
    })
)
import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('PhoneNumberCode', 
    new Schema({
        id: {type: ObjectId},
        phoneNumber: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        expiredAt: {
            type: Number,
            required: true
        }
    })
)
import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('Feedback', 
    new Schema({
        id: {type: ObjectId},
        userId: {
            type: ObjectId,
            required: true,
            ref: "User",
        },
        userTitle: {
            type: String,
        },
        content: {
            type: String,
            required: true
        },
        isShowInHomePage: {
           type: Boolean,
           required: true 
        }
    })
)
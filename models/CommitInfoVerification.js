import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('CommitInfoVerification', 
    new Schema({
        id: {type: ObjectId},
        optionOne: {
            type: Boolean
        },
        optionTwo: {
            type: Boolean
        },
        optionThree: {
            type: Boolean
        },
        optionFour: {
            type: Boolean
        },
        optionFive: {
            type: String
        },
        publicBankAccount: {
            type: Number,
            enum: [1, 2, 3],
            required: true
        },
        goalName: {
            type: String,
            required: true
        },
        targetAmount: {
            type: Number,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    })
)
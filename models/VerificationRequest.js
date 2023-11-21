import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('VerificationRequest', 
    new Schema({
        id: {type: ObjectId},
        type: {
            type: Number,
            enum: [1, 2],
            required: true
        },
        personalGeneralInfoId: {
            type: {ObjectId},
            ref: 'PersonalGeneralInfo'
        },
        organizationGeneralInfoId: {
            type: {ObjectId},
            ref: 'OrganizationGeneralInfo'
        },
        commitInfoVerificationId: {
            type: { ObjectId },
            ref: "CommitInfoVerification"
        },
        surveyInfoVerification: {
            type: { ObjectId },
            ref: "SurveyInfoVerification"
        }
    })
)
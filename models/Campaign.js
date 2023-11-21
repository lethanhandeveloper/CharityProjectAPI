import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('Campaign',
    new Schema({
        id: { 
            type: ObjectId 
        },
        creatorId: {
            type: ObjectId,
            required: true,
            ref: "User"
        },
        categoryId: {
            type: ObjectId,
            required: true,
            ref: "CampaignCategory"
        },
        itemTypeId: {
            type: ObjectId,
            required: true,
            ref: "ItemType"
        },
        provinceId: {
            type: ObjectId,
            required: true,
            ref: "Province"
        },
        title: {
            type: String,
            required: true
        },
        targetValue: {
            type: Number,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        }
    })
)
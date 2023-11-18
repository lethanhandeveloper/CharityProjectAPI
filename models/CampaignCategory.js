import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('CampaignCategory',
    new Schema({
        id: { type: ObjectId },
        name: {
            type: String,
            required: true,
            validate: {
                validator: (value) => value.length >= 3,
                message: "Name must be at least 5 characters"
            }
        },
    })
)
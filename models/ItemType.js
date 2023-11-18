import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('ItemType',
    new Schema({
        id: { type: ObjectId },
        name: {
            type: String,
            required: true,
            validate: {
                validator: (value) => value.length >= 3,
                message: "Name must be at least 3 characters"
            }
        },
        unit: {
            type: String,
            required: true,
        }
    })
)
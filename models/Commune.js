import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('Commune',
    new Schema({
        id: { type: ObjectId },
        districtId: {
            type: Schema.ObjectId,
            required: true,
            ref: "District"
        },
        name: {
            type: String,
            required: true,
            validate: {
                validator: (value) => value.length >= 3,
                message: "Name must be at least 3 characters"
            }
        }
    })
)
import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model('District', 
    new Schema({
        id: {type: ObjectId},
        provinceId: {
            type: Schema.ObjectId,
            required: true,
            ref: "Province"
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
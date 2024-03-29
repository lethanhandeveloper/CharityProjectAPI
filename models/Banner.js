import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "Banner",
  new Schema({
    id: { type: Schema.ObjectId },
    imageUrl: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
  })
);

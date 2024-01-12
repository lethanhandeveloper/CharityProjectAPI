import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "File",
  new Schema({
    id: { type: ObjectId },
    fileUrl: {
      type: String,
      require: true,
    },
  })
);

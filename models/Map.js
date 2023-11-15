import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "Map",
  new Schema({
    id: { type: ObjectId },
    lat: {
      type: String,
      require: true,
    },
    long: {
      type: String,
      require: true,
    },
    idRecord: {
      type: String,
      require: true,
    },
  })
);

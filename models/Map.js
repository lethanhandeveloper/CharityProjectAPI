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
    campaign: {
      type: Schema.ObjectId,
      required: true,
      ref: "Campaign",
    },
    type: {
      type: String,
      require: true,
    },
  })
);

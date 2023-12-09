import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "Map",
  new Schema({
    id: { type: ObjectId },
    lat: {
      type: Number,
      require: true,
    },
    long: {
      type: Number,
      require: true,
    },
    campaignId: {
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

import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "CommitInfoVerification",
  new Schema({
    id: { type: ObjectId },
    goalName: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  })
);

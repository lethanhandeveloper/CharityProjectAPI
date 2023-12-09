import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "OrganizationGeneralInfo",
  new Schema({
    id: { type: ObjectId },
    name: {
      type: String,
      required: true,
    },
    establishedDate: {
      type: Date,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    operationField: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    actionDescSocialLink: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    achivementDoc: {
      type: String,
      required: true,
    },
    representativeName: {
      type: String,
      required: true,
    },
    representativePhoneNumber: {
      type: String,
      required: true,
    },
    representativeEmail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  })
);

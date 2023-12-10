import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "VerificationRequest",
  new Schema({
    id: { type: ObjectId },
    type: {
      type: Number,
      enum: [1, 2],
      required: true,
    },
    personalGeneralInfoId: {
      type: ObjectId,
      ref: "PersonalGeneralInfo",
    },
    organizationGeneralInfoId: {
      type: ObjectId,
      ref: "OrganizationGeneralInfo",
    },
    commitInfoVerificationId: {
      type: ObjectId,
      ref: "CommitInfoVerification",
    },
    requestedUserId: {
      type: ObjectId,
      ref: "User",
    },
    status: {
      type: Number,
      default: 1,
      enum: [1, 2, 3], //dang cho phe duyet, da phe duyet, tu choi
    },
  })
);

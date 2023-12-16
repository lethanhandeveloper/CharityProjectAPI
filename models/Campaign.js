import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "Campaign",
  new Schema({
    id: {
      type: ObjectId,
    },
    creatorId: {
      type: Schema.ObjectId,
      required: true,
      ref: "User",
    },
    createdDate: {
      type: Date,
      required: true,
    },
    categoryId: {
      type: Schema.ObjectId,
      required: true,
      ref: "CampaignCategory",
    },
    itemTypeId: {
      type: Schema.ObjectId,
      required: true,
      ref: "ItemType",
    },
    provinceId: {
      type: Schema.ObjectId,
      required: true,
      ref: "Province",
    },
    title: {
      type: String,
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      //start, draft, end
      require: true,
    },
  })
);

import mongoose, { Schema, ObjectId } from "mongoose";
import isEmail from "validator/lib/isEmail.js";

export default mongoose.model(
  "User",
  new Schema({
    id: { type: ObjectId },
    name: {
      type: String,
      required: true,
      validate: {
        validator: (value) => value.length > 3,
        message: "Name must be at least 3 characters",
      },
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value) => isEmail(value),
        message: "Email is incorrect format",
      },
    },
    phoneNumber: {
      type: String,
      min: [10, "Phone number is incorrect"],
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
      message: "Gioi tinh khong hop le",
    },
    // 1 normal, 2 personal, 3 organization, 4 admin
    role: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
      message: "Role is not valid",
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Age must be greater than 18"],
    },
    image_url: {
      type: String,
    },
    communeId: {
      type: Schema.ObjectId,
      required: true,
      ref: "Commune",
    },
    specificAddress: {
      type: String,
    },
  })
);

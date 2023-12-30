import mongoose, { Schema, ObjectId } from "mongoose";

export default mongoose.model(
  "TransactionHash",
  new Schema({
    id: { type: ObjectId },
    transactionHash: {
        type: String,
    },
    transactionId: {
        type: String
    }
  })
);

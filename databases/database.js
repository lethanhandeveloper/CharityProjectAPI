import mongoose from "mongoose";
import Exception from "../utils/Exception.js";

async function connectDatabase() {
  try {
    let connection = await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    const { code } = error;
    if (error.code == 8000) {
      throw new Exception(Exception.WRONG_DB_USERNAME_PASSWORD);
    } else if (code == "ENOTFOUND") {
      throw new Exception(Exception.WRONG_CONNECTION_STRING);
    }
  }
}

export default connectDatabase;

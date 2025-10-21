import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Success: DB connected!");
  } catch (error) {
    console.log("Error: DB connection failed!");
    process.exit(1);
  }
};

export default connectDb;

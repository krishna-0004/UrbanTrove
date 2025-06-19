import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const ConnectDB = async () => {
    try {
        const connect = mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};
// utils/connectMongoDB.js
import mongoose from "mongoose";

const connectMongoDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.DATABASE, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if connection fails
    });
    console.log("Database Connected Successfully!");
  } catch (err) {
    console.error("Database Connection Error:", err);
    throw err;
  }
};

export default connectMongoDB;


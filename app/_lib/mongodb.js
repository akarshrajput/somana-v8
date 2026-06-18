// utils/connectMongoDB.js
import mongoose from "mongoose";

const DATABASE_URI = process.env.MONGODB_URI;

const connectMongoDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(DATABASE_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if connection fails
    });
    console.log("Database Connected Successfully!");
  } catch (err) {
    console.error("Database Connection Error:", err);
    throw err;
  }
};

export default connectMongoDB;



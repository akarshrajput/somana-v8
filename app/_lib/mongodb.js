// utils/connectMongoDB.js
import mongoose from "mongoose";

const DATABASE_URI = "mongodb+srv://akarshrajput01:sLXy7RF5O5WIYbAY@somanacluster0.ugwqix9.mongodb.net/?appName=somanaCluster0";

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



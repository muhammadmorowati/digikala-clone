import mongoose from "mongoose";

const connectToDB = async (): Promise<boolean | void> => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    }

    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error("❌ DB Connection Error ->", err);
  }
};

export default connectToDB;

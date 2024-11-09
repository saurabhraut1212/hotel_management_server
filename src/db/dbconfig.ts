import mongoose from "mongoose";


interface DBError extends Error {
  message: string;
}

const dbConnect = async (): Promise<void> => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to database");
  } catch (err) {
    const error = err as DBError;
    console.error("Error in connection with database:", error.message);
  }
};

export default dbConnect;

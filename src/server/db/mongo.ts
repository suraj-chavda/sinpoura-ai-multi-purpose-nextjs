import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri && process.env.NODE_ENV !== "test") {
  console.warn("MONGODB_URI is not set");
}

export async function connectMongo(): Promise<typeof mongoose> {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  return mongoose.connect(uri);
}

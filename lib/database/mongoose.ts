import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

interface MongoDBConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongoDBConnection = (global as any).mongoose || null;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "mydatabase",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

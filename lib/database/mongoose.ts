import mongoose, { Mongoose, ConnectOptions } from "mongoose";

// Advanced connection configuration
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "mydatabase";

// Interface to store connection state
interface MongoDBConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
  isConnecting: boolean;
  retryCount: number;
}

// Define a type for the global with mongoose property
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongoDBConnection | undefined;
}

// Create global cached instance
const cached: MongoDBConnection = global.mongoose || {
  conn: null,
  promise: null,
  isConnecting: false,
  retryCount: 0,
};

// Store cached instance globally if not exists
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Advanced Mongoose connection options
 */
const connectOptions: ConnectOptions = {
  dbName: MONGODB_DB_NAME,
  bufferCommands: false,
  autoIndex: true,
  serverSelectionTimeoutMS: 30000, // Increase server selection timeout
  socketTimeoutMS: 45000, // Increase socket timeout
  connectTimeoutMS: 30000, // Increase connection timeout
  maxPoolSize: 50, // Increase connection pool size
  minPoolSize: 10, // Minimum pool size
  maxIdleTimeMS: 50000, // Maximum idle time before closing connection
  heartbeatFrequencyMS: 10000, // Heartbeat frequency
  retryWrites: true,
  retryReads: true,
};

/**
 * Setup Mongoose event handlers
 */
const setupMongooseEvents = () => {
  mongoose.connection.on("connected", () => {
    console.log("🟢 MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("🔴 MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("🟠 MongoDB disconnected");
  });

  // Safely close connection on app termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
};

/**
 * Advanced database connection function
 * Features auto-retry, error detection, and caching
 */
export const connectToDatabase = async (): Promise<Mongoose> => {
  // 1. Check cached connection
  if (cached.conn) {
    // Verify current connection state
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Using cached MongoDB connection");
      return cached.conn;
    } else {
      // Reset connection if disconnected
      cached.conn = null;
      cached.promise = null;
    }
  }

  // 2. Validate connection info
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in environment variables");
    throw new Error("MONGODB_URI environment variable is not defined.");
  }

  // 3. Prevent concurrent connection attempts
  if (cached.isConnecting) {
    console.log("⏳ Connection already in progress, waiting...");
    if (cached.promise) {
      return cached.promise;
    }
    throw new Error("Connection in progress but promise is null");
  }

  try {
    cached.isConnecting = true;
    console.log(
      `🔄 Connecting to MongoDB (Attempt: ${cached.retryCount + 1})...`
    );

    // 4. Setup mongoose events
    setupMongooseEvents();

    // 5. Connect to database
    cached.promise = mongoose.connect(MONGODB_URI, connectOptions);

    // 6. Wait for connection to complete
    cached.conn = await cached.promise;

    // 7. Reset counters after success
    cached.isConnecting = false;
    cached.retryCount = 0;

    console.log(`✅ Successfully connected to MongoDB (${MONGODB_DB_NAME})`);
    return cached.conn;
  } catch (error) {
    // 8. Handle connection errors
    cached.isConnecting = false;
    cached.retryCount += 1;

    console.error("❌ MongoDB connection error:", error);

    // 9. Auto-retry (up to 3 times)
    if (cached.retryCount < 3) {
      console.log(`🔄 Retrying connection (${cached.retryCount}/3)...`);
      // Wait before retrying (with increased delay on each attempt)
      await new Promise((resolve) =>
        setTimeout(resolve, cached.retryCount * 1000)
      );
      return connectToDatabase();
    }
    throw error;
  }
};

/**
 * Helper function to check connection status
 */
export const getConnectionStatus = () => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
};

/**
 * Function to safely close the database connection
 */
export const disconnectFromDatabase = async () => {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    cached.isConnecting = false;
    console.log("✅ MongoDB disconnected successfully");
  }
};

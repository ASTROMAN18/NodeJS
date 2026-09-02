const mongoose = require("mongoose");

async function connectDB() {
  try {
    // Use Railway's MONGO_URL or fall back to MONGODB_URI
    let mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.warn("MongoDB connection string not found - running without database");
      return;
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Don't throw error to allow server to start without DB
    console.warn("Server will continue without database connection");
  }
}

module.exports = {
  connectDB
};

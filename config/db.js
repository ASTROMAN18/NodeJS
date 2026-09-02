const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("MONGODB_URI environment variable is not defined - running without database");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
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

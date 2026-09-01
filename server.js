const app = require("./app");
const { connectDB } = require("./config/db");
const { readBooksFromStream } = require("./utils/streamReader");
const { getAllBooks } = require("./modules/books");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to database
    await connectDB();
    console.log("Database connected successfully");

    // Read books from stream
    readBooksFromStream()
      .then((books) => {
        console.log("Books read from stream:", books);
      })
      .catch((error) => {
        console.error("Stream read error:", error.message);
      });

    // Get books from module
    console.log("Books from module:", getAllBooks());

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();

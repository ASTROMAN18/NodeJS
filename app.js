const express = require("express");
const path = require("path");
const { connectDB } = require("./config/db");
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const { readBooksFromStream } = require("./utils/streamReader");
const { getAllBooks } = require("./modules/books");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Welcome to Book Store API");
});

app.get("/about", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>About - Book Store</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>About Book Store</h1>
        <p>A simple Book Store API built with Node.js.</p>
      </body>
    </html>
  `);
});

app.use("/books", bookRoutes);
app.use("/", authRoutes);

async function startServer() {
  await connectDB();

  readBooksFromStream()
    .then((books) => {
      console.log("Books read from stream:", books);
    })
    .catch((error) => {
      console.error("Stream read error:", error.message);
    });

  console.log("Books from module:", getAllBooks());

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

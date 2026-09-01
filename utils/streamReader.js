const fs = require("fs");
const path = require("path");

function readBooksFromStream() {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../data/books.json");
    const stream = fs.createReadStream(filePath, { encoding: "utf8" });
    let data = "";

    stream.on("data", (chunk) => {
      data += chunk;
    });

    stream.on("end", () => {
      resolve(JSON.parse(data));
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
}

module.exports = {
  readBooksFromStream
};

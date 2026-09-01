const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true
  }
});

module.exports = mongoose.model("Book", bookSchema);

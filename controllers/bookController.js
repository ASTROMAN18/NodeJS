const Book = require("../models/Book");

async function getAllBooks(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .populate("author")
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments();

    res.status(200).json({
      books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id).populate("author");

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createBook(req, res) {
  try {
    const book = await Book.create(req.body);
    const populatedBook = await Book.findById(book._id).populate("author");

    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateBook(req, res) {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("author");

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteBook(req, res) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};

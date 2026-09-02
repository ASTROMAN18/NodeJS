// In-memory storage for demo purposes (bypass MongoDB for lab testing)
let books = [
  {
    _id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 42.99,
    description: "A handbook of agile software craftsmanship"
  },
  {
    _id: "2", 
    title: "Node.js Design Patterns",
    author: "Mario Casciaro",
    price: 39.99,
    description: "Best practices for Node.js development"
  }
];

async function getAllBooks(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const paginatedBooks = books.slice(skip, skip + limit);
    
    res.status(200).json({
      books: paginatedBooks,
      pagination: {
        total: books.length,
        page,
        limit,
        totalPages: Math.ceil(books.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getBookById(req, res) {
  try {
    const book = books.find(b => b._id === req.params.id);
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
    const newBook = {
      _id: Date.now().toString(),
      ...req.body
    };
    books.push(newBook);

    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateBook(req, res) {
  try {
    const bookIndex = books.findIndex(b => b._id === req.params.id);
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found." });
    }

    books[bookIndex] = { ...books[bookIndex], ...req.body };

    res.status(200).json(books[bookIndex]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteBook(req, res) {
  try {
    const bookIndex = books.findIndex(b => b._id === req.params.id);
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found." });
    }

    books.splice(bookIndex, 1);

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

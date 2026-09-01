const express = require("express");
const bookController = require("../controllers/bookController");
const { verifyToken } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", verifyToken, bookController.createBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", verifyToken, requireAdmin, bookController.deleteBook);

module.exports = router;

const express = require("express");
const router = express.Router();
const booksControllers = require("../controllers/books");

router.get("/", booksControllers.getAllBooks);
router.get("/:id", booksControllers.getOneBook);
router.get("/bestrating", booksControllers.getBestRatingBooks);
router.post("/", booksControllers.createBook);
router.put("/:id", booksControllers.modifyBook);
router.delete("/:id", booksControllers.deleteBook);
router.post("/:id/rating", booksControllers.addRating);

module.exports = router;

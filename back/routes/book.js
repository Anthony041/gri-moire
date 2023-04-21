const express = require("express");
const router = express.Router();
const bookControllers = require("../controllers/book");

router.get("/", bookControllers.getAllBooks);
router.get("/:id", bookControllers.getOneBook);
router.get("/bestrating", bookControllers.getBestRatingBooks);
router.post("/", bookControllers.createBook);
router.put("/:id", bookControllers.modifyBook);
router.delete("/:id", bookControllers.deleteBook);
router.post("/:id/rating", bookControllers.addRating);

module.exports = router;

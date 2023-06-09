const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookControllers = require("../controllers/book");

router.get("/", bookControllers.getAllBooks);
router.get("/bestrating", bookControllers.getBestRatingBooks);
router.get("/:id", bookControllers.getOneBook);
router.post("/", auth, multer, bookControllers.createBook);
router.put("/:id", auth, multer, bookControllers.modifyBook);
router.delete("/:id", auth, bookControllers.deleteBook);
router.post("/:id/rating", auth, bookControllers.addRating);

module.exports = router;

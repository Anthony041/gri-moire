const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bookControllers = require("../controllers/book");

router.get("/", bookControllers.getAllBooks);
router.get("/:id", bookControllers.getOneBook);
router.get("/bestrating", bookControllers.getBestRatingBooks);
router.post("/", auth, bookControllers.createBook);
router.put("/:id", auth, bookControllers.modifyBook);
router.delete("/:id", auth, bookControllers.deleteBook);
router.post("/:id/rating", auth, bookControllers.addRating);

module.exports = router;

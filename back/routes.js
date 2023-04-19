const Book = require("./models/Book");
const User = require("./models/User");

module.exports = function (app) {
  // signup
  app.post("/api/auth/signup", (req, res, next) => {
    const user = new User({
      ...req.body,
    });
    user
      .save()
      .then(() => res.status(201).json({ message: "utilisateur créé" }))
      .catch((error) => res.status(400).json({ error }));
  });

  // login
  app.post("/api/auth/login", (req, res, next) => {});

  // get books
  app.get("/api/books", (req, res, next) => {
    Book.find()
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(400).json({ error }));
  });

  // get book
  app.get("/api/books/:id", (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then((book) => res.status(200).json(book))
      .catch((error) => res.status(404).json({ error }));
  });

  // get best rating books
  app.get("/api/books/bestrating", (req, res, next) => {});

  // create book
  app.post("/api/books", (req, res, next) => {
    const book = new Book({
      ...req.body,
    });
    book
      .save()
      .then(() => res.status(201).json({ message: "livre ajouté" }))
      .catch((error) => res.status(400).json({ error }));
  });

  // modify book
  app.put("/api/books/:id", (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: "livre modifié" }))
      .catch((error) => res.status(400).json({ error }));
  });

  // delete book
  app.delete("/api/books/:id", (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "livre supprimé" }))
      .catch((error) => res.status(400).json({ error }));
  });

  // add rating
  app.post("/api/books/:id/rating", (req, res, next) => {});
};

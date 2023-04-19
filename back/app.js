require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const Book = require("./models/Book");
const User = require("./models/User");

const app = express();

app.use(express.json());

// mongoose connection
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.GRIMOIRE_USER +
      ":" +
      process.env.GRIMOIRE_PASSWORD +
      "@cluster0.zsxql1m.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// cross-origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// CRUD routes
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

module.exports = app;

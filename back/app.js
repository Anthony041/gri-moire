// Express
const express = require("express");
const app = express();
app.use(express.json());

// Dotenv
require("dotenv").config();

// Mongoose
const mongoose = require("mongoose");
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

// CORS
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

// routes
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const path = require("path");
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;

// dotenv
require("dotenv").config();

// Express
const express = require("express");
const app = express();

app.use(express.json());

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
require("./routes")(app);

module.exports = app;

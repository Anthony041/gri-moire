const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://John:A3(y@cluster0.zsxql1m.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

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

app.get("/api/books", (req, res, next) => {
  const books = [
    {
      _id: "1",
      userId: "8gfd1g5",
      title: "Du Côté de Chez Swann",
      author: "Marcel Proust",
      imageUrl:
        "https://cdn.futura-sciences.com/cdn-cgi/image/width=1920,quality=60,format=auto/sources/images/dossier/rte/9115_livre%20ouvert_Horia%20Varlan%20-flickr%20by%2020.jpg",
      year: 1913,
      genre: "Roman",
      ratings: [
        {
          userId: "5gfdg4fd",
          grade: 5,
        },
        {
          userId: "f5ds98g",
          grade: 5,
        },
      ],
      averageRating: 5,
    },
    {
      _id: "2",
      userId: "g14df5g4",
      title: "Notre-Dame-de-Paris",
      author: "Victor Hugo",
      imageUrl:
        "https://cdn.futura-sciences.com/cdn-cgi/image/width=1920,quality=60,format=auto/sources/images/dossier/rte/9115_livre%20ouvert_Horia%20Varlan%20-flickr%20by%2020.jpg",
      year: 1831,
      genre: "Roman",
      ratings: [
        {
          userId: "f5dgdgfd",
          grade: 5,
        },
        {
          userId: "gdfg5dfgfd6",
          grade: 3,
        },
      ],
      averageRating: 4,
    },
  ];
  res.status(200).json(books);
  next();
});

app.post("/api/auth/login", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "utilisateur connecté",
  });
});

module.exports = app;

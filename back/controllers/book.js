const Book = require("../models/Book");
const fs = require("fs");
const sharp = require("sharp");

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getBestRatingBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      books.sort((a, b) => b.averageRating - a.averageRating);
      const top3Books = books.slice(0, 3);
      res.status(200).json(top3Books);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
  // récupération des données saisies
  const bookObject = JSON.parse(req.body.book);

  // suppression des id fournis par le client
  delete bookObject._id;
  delete bookObject._userId;

  // redimensionnement de l'image stockée sur le serveur
  sharp(`images/${req.file.filename}`)
    .resize({ width: 405 })
    .toFile(`images/resized-${req.file.filename}`)

    // cas où le redimensionnement a fonctionné
    .then(() => {
      // suppression de l'image de la requête déjà stockée
      fs.unlink(`images/${req.file.filename}`, () => {
        // création du livre à enregistrer
        const book = new Book({
          ...bookObject,
          userId: req.auth.userId,
          imageUrl: `${req.protocol}://${req.get("host")}/images/resized-${
            req.file.filename
          }`,
        });

        // enregistrement du livre
        book
          .save()
          .then(() => res.status(201).json({ message: "livre ajouté" }))

          // cas où l'enregistrement n'a pas fonctionné
          .catch((error) => res.status(400).json({ error }));
      });
    })

    // cas où le redimensionnement n'a pas fonctionné
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  // création de l'objet incluant les modifications indiquées sur le formulaire
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/resized-${
          req.file.filename
        }`,
      }
    : { ...req.body };

  // suppression de l'id fourni par le client
  delete bookObject._userId;

  // recherche du livre à modifier
  Book.findOne({ _id: req.params.id })

    // cas où le livre a été trouvé
    .then((book) => {
      // cas où l'utilisateur identifié n'est pas celui qui a créé le livre
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "non autorisé" });

        // cas où l'utilisateur identifié n'est bien celui qui a créé le livre
      } else {
        // mise à jour du livre si l'image n'est pas à modifier
        if (bookObject.imageUrl === undefined) {
          Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "livre modifié" }))
            .catch((error) => res.status(400).json({ error }));

          // redimensionnement de l'image stockée sur le serveur si l'image est à modifier
        } else {
          sharp(`images/${req.file.filename}`)
            .resize({ width: 405 })
            .toFile(`images/resized-${req.file.filename}`)

            // cas où le redimensionnement a fonctionné
            .then(() => {
              // suppression de l'image de la requête déjà stockée
              fs.unlink(`images/${req.file.filename}`, () => {
                // suppression de l'ancienne image du livre
                Book.findOne({ _id: req.params.id })
                  .then((book) => {
                    const filename = book.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => {
                      // puis mise à jour du livre
                      Book.updateOne(
                        { _id: req.params.id },
                        { ...bookObject, _id: req.params.id }
                      )
                        .then(() =>
                          res.status(200).json({ message: "livre modifié" })
                        )
                        .catch((error) => res.status(400).json({ error }));
                    });
                  })
                  .catch((error) => res.status(400).json({ error }));
              });
            })
            // cas où le redimensionnement n'a pas fonctionné
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })

    // cas où le livre n'a pas été trouvé
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "non autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "livre supprimé" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.addRating = (req, res, next) => {
  // recherche du livre à noter
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // création d'un tableau des utilisateurs ayant noté le livre à partir du tableau d'objets des notes
      const users = book.ratings.map((el) => el.userId);

      // test si l'utilisateur qui souhaite noter le livre l'a déjà noté
      if (users.includes(req.body.userId)) {
        // cas où l'utilisateur a déjà noté le livre
        res.status(403).json({ message: "livre déjà noté" });
      }

      // cas où l'utilisateur n'a pas encore noté le livre
      else {
        // ajout de la note
        Book.updateOne(
          { _id: req.params.id },
          {
            $push: {
              ratings: { userId: req.body.userId, grade: req.body.rating },
            },
          }
        ).then(() => {
          // une fois la promesse résolue (note ajoutée)
          return (
            // on récupère le livre mis à jour
            Book.findOne({ _id: req.params.id })
              .then((book) => {
                // calcul de la moyenne
                const grades = book.ratings.map((el) => el.grade);
                const sumOfGrades = grades.reduce(
                  (accumulator, currentValue) => accumulator + currentValue
                );
                const average = (sumOfGrades / grades.length).toFixed(1);

                // mise à jour de la moyenne
                return (
                  Book.updateOne(
                    { _id: req.params.id },
                    {
                      $set: {
                        averageRating: average,
                      },
                    }
                  )
                    // note ajoutée et moyenne mise à jour
                    .then(() => {
                      // une fois la promesse résolue (moyenne mise à jour)
                      return (
                        // on récupère le livre mis à jour
                        Book.findOne({ _id: req.params.id })
                          .then((book) => {
                            // on envoie le livre au front-end
                            res.status(201).json(book);
                          })
                          .catch((error) => res.status(400).json({ error }))
                      );
                    })
                    // cas où la moyenne n'a pas été mise à jour
                    .catch((error) => res.status(400).json({ error }))
                );
              })
              // cas où la note n'a pas été ajoutée
              .catch((error) => res.status(400).json({ error }))
          );
        });
      }
    })
    // cas où le livre n'a pas été trouvé
    .catch((error) => res.status(400).json({ error }));
};

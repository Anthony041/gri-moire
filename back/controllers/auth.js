const User = require("../models/User");

exports.signup = (req, res, next) => {
  const user = new User({
    ...req.body,
  });
  user
    .save()
    .then(() => res.status(201).json({ message: "utilisateur créé" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {};

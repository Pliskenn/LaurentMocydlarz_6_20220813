const saucesModel = require("../models/Sauces");

exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  delete saucesObject._userId;
  const sauces = new Sauces({
    ...saucesObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });

  saucesModel.save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  saucesModel.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  saucesModel.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  saucesModel.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  saucesModel.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

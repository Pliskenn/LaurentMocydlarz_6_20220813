const saucesModel = require("../models/Sauces");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  delete saucesObject._userId;
  const sauces = new saucesModel({
    ...saucesObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauces
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  saucesModel
    .findOne({ _id: req.params.id })
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauces.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          sauces
            .deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.modifySauce = (req, res, next) => {
  const saucesObject = req.file
    ? {
        ...JSON.parse(req.body.sauces),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete saucesObject._userId;
  saucesModel
    .findOne({ _id: req.params.id })
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        saucesModel
          .updateOne(
            { _id: req.params.id },
            { ...saucesObject, _id: req.params.id }
          )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  saucesModel
    .findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  saucesModel
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.like = (req, res, next) => {
  // Ajouter un like

  saucesModel
    .findOne({ _id: req.params.id })
    .then((sauces) => {
      if (
        (sauces.usersDisliked.includes(req.body.userId) && req.body.like === -1) ||
        (sauces.usersLiked.includes(req.body.userId) && req.body.like === 1)
      ) {
        res
          .status(401)
          .json({ message: "Vous ne pouvez pas voter deux fois !" });
      }

      let params = {};
      switch (req.body.like) {
        case -1:
          params = {
            $push: { usersDisliked: req.body.userId },
            $inc: { dislikes: 1 },
          };
          break;

        case 1:
          params = {
            $push: { usersLiked: req.body.userId },
            $inc: { likes: 1 },
          };
          break;

        case 0:
          // Vérifier si like = 0 /si oui, vérifier que le userDislike.includes.userId = oui
          let pullParams = null;
          if (sauces.usersDisliked.includes(req.body.userId))
   {         pullParams = { usersDisliked: req.body.userId };
            params = {
              $pull: pullParams,
              $inc: { dislikes: -1 },
            };}
            

          if (sauces.usersLiked.includes(req.body.userId))
            {pullParams = { usersLiked: req.body.userId };
            params = {
              $pull: pullParams,
              $inc: { likes: -1 },
            };}
          break; 

        default:
          break;
      }
      saucesModel
        .updateOne({ _id: req.params.id }, params)
        .then(() =>
          res.status(200).json({ message: "Votre vote a été pris en compte !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};

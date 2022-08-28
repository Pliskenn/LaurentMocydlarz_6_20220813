const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/Users');

// Création d'un utilisateur
exports.signup = (req, res) => {
    // console.log(req)
    // res.send({
    //           email: req.body.email,
    //           password: req.body.password
    //         });
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// Login de l'utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Vos identifants de connexion sont inccorects'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Vos identifants de connexion sont inccorects' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign (
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: "1d" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };
// Définition de la constante express
const express = require('express');
// Définition de la constante Thing = chemin vers le modèle de base de données
const Sauces = require('./models/Sauces');
const Users = require('./models/Users');

// Définition de la constante mongoose : va nous permettre d'utiliser MongoDB (installé dans node_modules)
const mongoose = require('mongoose');
// Express 
const app = express();

// Connexion à la base de données
mongoose.connect('mongodb+srv://pliskenn:whcjZ4LY7lm6DtXM@piiquantedb.f56gefz.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Données express retournées en json
app.use(express.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Publier une sauce (Route à définir)
app.post('/api/sauces', (req, res, next) => {
  delete req.body._id;
  const sauces = new Sauces({
    ...req.body
  });
  Sauces.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

// Supprimer une sauce
app.delete('/api/sauces/:id', (req, res, next) => {
  Sauces.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

// Modifier une sauce
app.put('/api/sauces/:id', (req, res, next) => {
  Sauces.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

// Récupérer une sauce
app.get('/api/sauces/:id', (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

// Récupérer la liste des sauces
app.get('/api/sauces', (req, res, next) => {
  Sauces.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;
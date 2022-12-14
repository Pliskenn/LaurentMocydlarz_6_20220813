// Définition de la constante express
const express = require('express');
const path = require('path');
// Définition de la constante mongoose : va nous permettre d'utiliser MongoDB (installé dans node_modules)
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

// Route Sauces
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

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

app.use(bodyParser.json());

app.get('/', function routeHandler(req, res) {
  res.send('ok');
  });
  
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
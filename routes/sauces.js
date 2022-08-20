const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

// Publier une sauce (Route à définir)
router.post('/', saucesCtrl.createSauce);
// Supprimer une sauce
router.delete('/:id', saucesCtrl.deleteSauce);  
// Modifier une sauce
router.put('/:id', saucesCtrl.modifySauce);
  // Récupérer une sauce
router.get('/:id', saucesCtrl.getOneSauce);
// Récupérer la liste des sauces
router.get('/', saucesCtrl.getAllSauces);

module.exports = router;
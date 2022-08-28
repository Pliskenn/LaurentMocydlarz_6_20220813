const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

// Publier une sauce (Route à définir)
router.post('/', auth, multer, saucesCtrl.createSauce);
// Supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);  
// Modifier une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
  // Récupérer une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);
// Récupérer la liste des sauces
router.get('/', auth, saucesCtrl.getAllSauces);

module.exports = router;
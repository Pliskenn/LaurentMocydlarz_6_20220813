const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauces');

const router = express.Router();


// Publier une sauce (Route à définir)
router.post('/', auth, multer, saucesCtrl.createSauce);
// Supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);  
// Modifier une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// Ajouter/supprimer un like
router.post('/:id/like', auth, saucesCtrl.like);
  // Récupérer une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);
// Récupérer la liste des sauces
router.get('/', auth, saucesCtrl.getAllSauces);


module.exports = router;
/**
 * Routes Progress - Définition des endpoints pour la progression
 */

const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// GET /progress - Récupère tous les enregistrements de progression
// Query params: ?user_id=X pour filtrer par utilisateur
router.get('/', progressController.getAll);

// GET /progress/:id - Récupère une progression spécifique
router.get('/:id', progressController.getById);

// POST /progress - Crée un nouvel enregistrement de progression
router.post('/', progressController.create);

// PUT /progress/:id - Met à jour une progression
router.put('/:id', progressController.update);

// DELETE /progress/:id - Supprime une progression
router.delete('/:id', progressController.deleteById);

module.exports = router;


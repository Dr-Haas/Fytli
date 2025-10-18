/**
 * Routes Categories - Définition des endpoints pour les catégories
 */

const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// GET /categories - Récupère toutes les catégories
router.get('/', categoriesController.getAll);

// GET /categories/:id - Récupère une catégorie spécifique
router.get('/:id', categoriesController.getById);

// POST /categories - Crée une nouvelle catégorie
router.post('/', categoriesController.create);

// PUT /categories/:id - Met à jour une catégorie
router.put('/:id', categoriesController.update);

// DELETE /categories/:id - Supprime une catégorie
router.delete('/:id', categoriesController.deleteById);

module.exports = router;


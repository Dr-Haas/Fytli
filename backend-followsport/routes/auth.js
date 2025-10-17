/**
 * Routes Auth - Définition des endpoints d'authentification
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// POST /auth/register - Inscription d'un nouvel utilisateur
router.post('/register', authController.register);

// POST /auth/login - Connexion d'un utilisateur
router.post('/login', authController.login);

// GET /auth/me - Récupère le profil de l'utilisateur connecté (route protégée)
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;


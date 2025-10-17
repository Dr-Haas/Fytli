/**
 * Routes pour l'upload de fichiers
 * Gère les images, vidéos et documents
 */

const express = require('express');
const router = express.Router();
const { uploadImage, uploadVideo, uploadDocument, getFileUrl } = require('../config/multer');
const authMiddleware = require('../middleware/auth');

/**
 * Upload d'une image
 * POST /uploads/image
 */
router.post('/image', authMiddleware, uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier n\'a été uploadé'
      });
    }

    const fileUrl = getFileUrl(req.file.filename, 'images');

    res.status(201).json({
      success: true,
      message: 'Image uploadée avec succès',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Erreur upload image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image',
      error: error.message
    });
  }
});

/**
 * Upload d'une vidéo
 * POST /uploads/video
 */
router.post('/video', authMiddleware, uploadVideo.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier n\'a été uploadé'
      });
    }

    const fileUrl = getFileUrl(req.file.filename, 'videos');

    res.status(201).json({
      success: true,
      message: 'Vidéo uploadée avec succès',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Erreur upload vidéo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de la vidéo',
      error: error.message
    });
  }
});

/**
 * Upload d'un document
 * POST /uploads/document
 */
router.post('/document', authMiddleware, uploadDocument.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier n\'a été uploadé'
      });
    }

    const fileUrl = getFileUrl(req.file.filename, 'documents');

    res.status(201).json({
      success: true,
      message: 'Document uploadé avec succès',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Erreur upload document:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload du document',
      error: error.message
    });
  }
});

/**
 * Upload multiple d'images
 * POST /uploads/images
 */
router.post('/images', authMiddleware, uploadImage.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier n\'a été uploadé'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: getFileUrl(file.filename, 'images')
    }));

    res.status(201).json({
      success: true,
      message: `${files.length} image(s) uploadée(s) avec succès`,
      data: files
    });
  } catch (error) {
    console.error('Erreur upload multiple images:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload des images',
      error: error.message
    });
  }
});

module.exports = router;


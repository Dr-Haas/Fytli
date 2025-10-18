/**
 * Contrôleur Upload - Gestion des uploads de fichiers
 */

const path = require('path');
const fs = require('fs');

/**
 * Upload un fichier (photo de session)
 * POST /upload/session-photo
 */
const uploadSessionPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier n\'a été uploadé'
      });
    }

    // Construire l'URL complète du fichier
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/session-photos/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Photo uploadée avec succès',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Erreur uploadSessionPhoto:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de la photo',
      error: error.message
    });
  }
};

/**
 * Supprime une photo de session
 * DELETE /upload/session-photo/:filename
 */
const deleteSessionPhoto = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Sécurité : vérifier que le filename ne contient pas de path traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier invalide'
      });
    }

    const filePath = path.join(__dirname, '../uploads/session-photos', filename);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Fichier non trouvé'
      });
    }

    // Supprimer le fichier
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Photo supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteSessionPhoto:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la photo',
      error: error.message
    });
  }
};

module.exports = {
  uploadSessionPhoto,
  deleteSessionPhoto
};


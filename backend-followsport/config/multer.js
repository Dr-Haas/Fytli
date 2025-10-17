/**
 * Configuration de Multer pour l'upload de fichiers
 * Gère les uploads d'images et de vidéos avec validation
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers d'uploads s'ils n'existent pas
const uploadsDir = path.join(__dirname, '../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const videosDir = path.join(uploadsDir, 'videos');
const documentsDir = path.join(uploadsDir, 'documents');

[uploadsDir, imagesDir, videosDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Configuration du stockage pour les images
 */
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}${ext}`);
  }
});

/**
 * Configuration du stockage pour les vidéos
 */
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `video-${uniqueSuffix}${ext}`);
  }
});

/**
 * Configuration du stockage pour les documents
 */
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});

/**
 * Filtre pour les images uniquement
 */
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
  }
};

/**
 * Filtre pour les vidéos uniquement
 */
const videoFileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|mkv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /video/.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Seules les vidéos sont autorisées (mp4, avi, mov, mkv, webm)'));
  }
};

/**
 * Filtre pour les documents
 */
const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|md/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les documents sont autorisés (pdf, doc, docx, txt, md)'));
  }
};

/**
 * Middleware Multer pour upload d'images
 * Limite: 5MB par fichier
 */
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

/**
 * Middleware Multer pour upload de vidéos
 * Limite: 100MB par fichier
 */
const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

/**
 * Middleware Multer pour upload de documents
 * Limite: 10MB par fichier
 */
const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

/**
 * Helper pour générer l'URL d'accès au fichier
 */
const getFileUrl = (filename, type = 'images') => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:9001';
  return `${baseUrl}/uploads/${type}/${filename}`;
};

/**
 * Helper pour supprimer un fichier
 */
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

module.exports = {
  uploadImage,
  uploadVideo,
  uploadDocument,
  getFileUrl,
  deleteFile
};


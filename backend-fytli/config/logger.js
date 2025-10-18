/**
 * Configuration du système de logs avec Winston
 * Logs dans des fichiers avec rotation automatique
 */

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../logs');

// Format personnalisé pour les logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack 
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Transport pour les logs d'erreurs (rotation quotidienne)
const errorRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d', // Conserve 14 jours de logs
  format: logFormat
});

// Transport pour tous les logs (rotation quotidienne)
const combinedRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat
});

// Configuration du logger Winston
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    errorRotateTransport,
    combinedRotateTransport
  ]
});

// Ajouter la console en développement
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Helper pour logger les requêtes HTTP
 */
const logRequest = (req) => {
  logger.info(`${req.method} ${req.path} - IP: ${req.ip} - User: ${req.user?.userId || 'anonymous'}`);
};

/**
 * Helper pour logger les erreurs
 */
const logError = (error, context = '') => {
  logger.error(`${context ? context + ' - ' : ''}${error.message}`, { stack: error.stack });
};

module.exports = {
  logger,
  logRequest,
  logError
};


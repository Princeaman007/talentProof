/**
 * Logger centralisé avec Winston
 * ✅ Structured logging (JSON)
 * ✅ Levels: error, warn, info, debug
 * ✅ Logs fichier + console
 */
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '..', 'logs');

// Format personnalisé
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(Object.keys(meta).length > 0 && { metadata: meta }),
    });
  })
);

// Transport console (colorisé)
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(
      ({ timestamp, level, message, ...meta }) =>
        `${timestamp} [${level}] ${message} ${
          Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : ''
        }`
    )
  ),
});

// Transport fichier (erreurs)
const errorFileTransport = new winston.transports.File({
  filename: path.join(logsDir, 'error.log'),
  level: 'error',
  format: customFormat,
});

// Transport fichier (tout)
const combinedFileTransport = new winston.transports.File({
  filename: path.join(logsDir, 'combined.log'),
  format: customFormat,
});

// Créer le logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    consoleTransport,
    ...(process.env.NODE_ENV === 'production'
      ? [errorFileTransport, combinedFileTransport]
      : []),
  ],
});

export default logger;

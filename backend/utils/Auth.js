import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Hasher un mot de passe
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<string>} - Mot de passe hashé
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Comparer un mot de passe avec son hash
 * @param {string} password - Mot de passe en clair
 * @param {string} hashedPassword - Mot de passe hashé
 * @returns {Promise<boolean>} - True si correspond
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Générer un token JWT
 * @param {Object} payload - Données à encoder dans le token
 * @param {string} expiresIn - Durée de validité (ex: '24h', '1h')
 * @returns {string} - Token JWT
 */
export const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Vérifier et décoder un token JWT
 * @param {string} token - Token JWT
 * @returns {Object|null} - Payload décodé ou null si invalide
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Générer un token aléatoire sécurisé (pour confirmation email, reset password)
 * @returns {string} - Token hexadécimal
 */
export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hasher un token pour stockage en base de données
 * @param {string} token - Token en clair
 * @returns {string} - Token hashé
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
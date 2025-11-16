/**
 * Configuration de cookie sécurisé pour les tokens JWT
 * ✅ SÉCURITÉ: HttpOnly + Secure + SameSite
 */

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,        // ✅ JavaScript ne peut pas accéder (protection XSS)
    secure: isProduction,  // ✅ HTTPS seulement en production
    sameSite: 'Strict',    // ✅ Prévention CSRF
    maxAge: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
    path: '/',
  };
};

/**
 * Définir le cookie JWT dans la réponse
 * @param {Object} res - Response object
 * @param {string} token - JWT token
 */
export const setTokenCookie = (res, token) => {
  res.cookie('token', token, getCookieOptions());
};

/**
 * Nettoyer le cookie JWT (logout)
 * @param {Object} res - Response object
 */
export const clearTokenCookie = (res) => {
  res.clearCookie('token', { path: '/' });
};

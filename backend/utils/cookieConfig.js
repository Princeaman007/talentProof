/**
 * Configuration de cookie sécurisé pour les tokens JWT
 * ✅ SÉCURITÉ: HttpOnly + Secure + SameSite
 */

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true,        // ✅ JavaScript ne peut pas accéder (protection XSS)
    secure: isProduction,  // ✅ HTTPS seulement en production
    sameSite: isProduction ? 'None' : 'Lax',    // ✅ 'None' pour cross-origin en production
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

/**
 * Options pour le refresh token (longue durée)
 */
export const getRefreshCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',    // ✅ 'None' pour cross-origin en production
    // Par défaut 7 jours
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRE_MS, 10) || 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, getRefreshCookieOptions());
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', { path: '/' });
};

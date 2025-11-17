/**
 * Utilitaire de pagination sécurisée
 * ✅ Limites max enforced
 * ✅ Validation des params
 * ✅ Réutilisable partout
 */

/**
 * Extraire et valider les paramètres de pagination
 * @param {Object} query - Express query params
 * @param {number} defaultLimit - Limite par défaut (défaut: 20)
 * @param {number} maxLimit - Limite maximale (défaut: 100)
 * @returns {Object} {skip, limit, page}
 */
export const getPaginationParams = (
  query,
  defaultLimit = 20,
  maxLimit = 100
) => {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || defaultLimit;

  // Validation et sécurité
  if (page < 1) page = 1;
  if (limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit; // 🔒 Enforce max limit

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

/**
 * Construire la réponse paginée
 * @param {Array} items - Les items à retourner
 * @param {number} totalCount - Nombre total d'items
 * @param {Object} paginationParams - {page, limit, skip}
 * @returns {Object} Réponse paginée complète
 */
export const buildPaginatedResponse = (items, totalCount, paginationParams) => {
  const { page, limit } = paginationParams;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems: totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Middleware pour ajouter les paramètres de pagination à req
 * ✅ À utiliser dans les routes nécessitant pagination
 */
export const paginationMiddleware = (defaultLimit = 20, maxLimit = 100) => {
  return (req, res, next) => {
    req.pagination = getPaginationParams(req.query, defaultLimit, maxLimit);
    next();
  };
};

export default {
  getPaginationParams,
  buildPaginatedResponse,
  paginationMiddleware,
};

/**
 * Utilitaires pour la pagination
 * Permet de paginer les résultats de requêtes SQL
 */

/**
 * Calcule les paramètres de pagination
 * @param {Object} query - Query params de la requête (req.query)
 * @returns {Object} Paramètres de pagination (page, limit, offset)
 */
const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Formate la réponse paginée
 * @param {Array} data - Données de la page courante
 * @param {number} total - Nombre total d'éléments
 * @param {number} page - Numéro de page courante
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Object} Réponse formatée avec métadonnées de pagination
 */
const formatPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      itemsOnPage: data.length,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    }
  };
};

/**
 * Ajoute la clause LIMIT et OFFSET à une requête SQL
 * @param {string} query - Requête SQL de base
 * @param {number} limit - Nombre d'éléments par page
 * @param {number} offset - Offset de départ
 * @returns {string} Requête SQL avec pagination
 */
const addPaginationToQuery = (query, limit, offset) => {
  return `${query} LIMIT ${limit} OFFSET ${offset}`;
};

/**
 * Extrait la requête de comptage à partir d'une requête SELECT
 * @param {string} selectQuery - Requête SELECT originale
 * @returns {string} Requête COUNT(*) correspondante
 */
const getCountQuery = (selectQuery) => {
  // Remplace le SELECT ... FROM par SELECT COUNT(*) FROM
  return selectQuery.replace(/SELECT .+ FROM/i, 'SELECT COUNT(*) as total FROM');
};

module.exports = {
  getPaginationParams,
  formatPaginatedResponse,
  addPaginationToQuery,
  getCountQuery
};


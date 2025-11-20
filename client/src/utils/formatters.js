/**
 * Utilitaires de formatage de données
 * Élimine les affichages "undefined", "null", "NaN"
 * Remplace par des valeurs par défaut professionnelles
 */

/**
 * Formate le nom d'affichage d'un utilisateur
 * Gère les cas où nom/prénom sont manquants
 * 
 * @param {Object} user - Objet utilisateur
 * @param {string} user.nom - Nom de famille
 * @param {string} user.prenom - Prénom
 * @param {string} user.email - Email (fallback)
 * @returns {string} Nom formaté
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Utilisateur inconnu';
  
  const { nom, prenom, email } = user;
  
  if (prenom && nom) {
    return `${prenom} ${nom}`;
  }
  
  if (nom) {
    return nom;
  }
  
  if (prenom) {
    return prenom;
  }
  
  if (email) {
    return email.split('@')[0]; // Première partie de l'email
  }
  
  return 'Utilisateur inconnu';
};

/**
 * Formate le nom d'une entreprise
 * 
 * @param {Object} company - Objet entreprise
 * @param {string} company.nom - Nom de l'entreprise
 * @returns {string} Nom formaté
 */
export const getCompanyDisplayName = (company) => {
  if (!company) return 'Entreprise inconnue';
  return company.nom || company.name || 'Entreprise inconnue';
};

/**
 * Formate une localisation (ville, pays)
 * 
 * @param {string} location - Localisation
 * @returns {string} Localisation formatée
 */
export const formatLocation = (location) => {
  if (!location || location === 'undefined' || location === 'null') {
    return 'Non spécifié';
  }
  return location;
};

/**
 * Formate le nombre de places disponibles pour un événement
 * 
 * @param {number} available - Places disponibles
 * @param {number} total - Total de places
 * @returns {string} Texte formaté
 */
export const formatAvailablePlaces = (available, total) => {
  if (typeof available !== 'number' || isNaN(available)) {
    return 'Places non disponibles';
  }
  
  if (available <= 0) {
    return 'Complet';
  }
  
  if (typeof total === 'number' && !isNaN(total)) {
    return `${available} / ${total} places disponibles`;
  }
  
  return `${available} places disponibles`;
};

/**
 * Formate une date en français
 * 
 * @param {string|Date} date - Date à formater
 * @param {boolean} withTime - Inclure l'heure
 * @returns {string} Date formatée
 */
export const formatDate = (date, withTime = false) => {
  if (!date) return 'Date non définie';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    
    if (withTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return dateObj.toLocaleDateString('fr-FR', options);
  } catch (error) {
    return 'Date invalide';
  }
};

/**
 * Formate une date courte (format compact)
 * 
 * @param {string|Date} date - Date à formater
 * @returns {string} Date formatée (ex: 15/03/2024)
 */
export const formatDateShort = (date) => {
  if (!date) return 'Non définie';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalide';
    }
    
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    return 'Invalide';
  }
};

/**
 * Formate une heure
 * 
 * @param {string|Date} date - Date contenant l'heure
 * @returns {string} Heure formatée (ex: 14:30)
 */
export const formatTime = (date) => {
  if (!date) return 'Non définie';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalide';
    }
    
    return dateObj.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'Invalide';
  }
};

/**
 * Formate un numéro de téléphone
 * 
 * @param {string} phone - Numéro de téléphone
 * @returns {string} Téléphone formaté
 */
export const formatPhone = (phone) => {
  if (!phone || phone === 'undefined' || phone === 'null') {
    return 'Non renseigné';
  }
  
  // Nettoyer le numéro
  const cleaned = phone.replace(/\D/g, '');
  
  // Format français: 06 12 34 56 78
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  return phone;
};

/**
 * Formate un email (sécurisé pour affichage)
 * 
 * @param {string} email - Email
 * @param {boolean} obfuscate - Masquer une partie (ex: j***@example.com)
 * @returns {string} Email formaté
 */
export const formatEmail = (email, obfuscate = false) => {
  if (!email || email === 'undefined' || email === 'null') {
    return 'Non renseigné';
  }
  
  if (!obfuscate) {
    return email;
  }
  
  const [local, domain] = email.split('@');
  if (!domain) return email;
  
  const obfuscatedLocal = local.length > 2 
    ? local[0] + '***' + local[local.length - 1]
    : local[0] + '***';
  
  return `${obfuscatedLocal}@${domain}`;
};

/**
 * Formate un prix en euros
 * 
 * @param {number} price - Prix
 * @returns {string} Prix formaté
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'Prix non disponible';
  }
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

/**
 * Formate un nombre avec séparateurs de milliers
 * 
 * @param {number} number - Nombre
 * @returns {string} Nombre formaté
 */
export const formatNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return 'N/A';
  }
  
  return new Intl.NumberFormat('fr-FR').format(number);
};

/**
 * Formate une adresse complète
 * 
 * @param {Object} address - Objet adresse
 * @param {string} address.street - Rue
 * @param {string} address.city - Ville
 * @param {string} address.zipCode - Code postal
 * @param {string} address.country - Pays
 * @returns {string} Adresse formatée
 */
export const formatAddress = (address) => {
  if (!address) return 'Adresse non renseignée';
  
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.zipCode && address.city) {
    parts.push(`${address.zipCode} ${address.city}`);
  } else if (address.city) {
    parts.push(address.city);
  }
  if (address.country) parts.push(address.country);
  
  return parts.length > 0 ? parts.join(', ') : 'Adresse non renseignée';
};

/**
 * Tronque un texte avec ellipse
 * 
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text === 'undefined' || text === 'null') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Formate un statut (badge)
 * 
 * @param {string} status - Statut
 * @returns {Object} Configuration du badge (text, color)
 */
export const formatStatus = (status) => {
  const statusConfig = {
    active: { text: 'Actif', color: 'green' },
    inactive: { text: 'Inactif', color: 'gray' },
    pending: { text: 'En attente', color: 'yellow' },
    confirmed: { text: 'Confirmé', color: 'blue' },
    cancelled: { text: 'Annulé', color: 'red' },
    completed: { text: 'Terminé', color: 'green' },
  };
  
  return statusConfig[status?.toLowerCase()] || { text: 'Inconnu', color: 'gray' };
};

/**
 * Valeur par défaut sûre
 * Remplace undefined/null/NaN par une valeur par défaut
 * 
 * @param {*} value - Valeur à vérifier
 * @param {*} defaultValue - Valeur par défaut
 * @returns {*} Valeur sûre
 */
export const safeValue = (value, defaultValue = 'Non renseigné') => {
  if (value === undefined || value === null || value === '' || 
      (typeof value === 'number' && isNaN(value)) ||
      value === 'undefined' || value === 'null') {
    return defaultValue;
  }
  return value;
};

export default {
  getUserDisplayName,
  getCompanyDisplayName,
  formatLocation,
  formatAvailablePlaces,
  formatDate,
  formatDateShort,
  formatTime,
  formatPhone,
  formatEmail,
  formatPrice,
  formatNumber,
  formatAddress,
  truncateText,
  formatStatus,
  safeValue,
};

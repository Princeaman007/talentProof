/**
 * Fonctions de validation réutilisables pour les formulaires
 * Utilisées pour validation en temps réel côté client
 */

/**
 * Valide une adresse email
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'L\'email est requis' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format d\'email invalide' };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un mot de passe
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Le mot de passe est requis' };
  }
  
  if (password.length < 6) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
  }
  
  // Optionnel: validation plus stricte
  // if (!/(?=.*[a-z])/.test(password)) {
  //   return { valid: false, error: 'Le mot de passe doit contenir au moins une minuscule' };
  // }
  // if (!/(?=.*[A-Z])/.test(password)) {
  //   return { valid: false, error: 'Le mot de passe doit contenir au moins une majuscule' };
  // }
  // if (!/(?=.*\d)/.test(password)) {
  //   return { valid: false, error: 'Le mot de passe doit contenir au moins un chiffre' };
  // }
  
  return { valid: true, error: null };
};

/**
 * Valide la confirmation de mot de passe
 */
export const validatePasswordConfirmation = (password, confirmation) => {
  if (!confirmation) {
    return { valid: false, error: 'Veuillez confirmer le mot de passe' };
  }
  
  if (password !== confirmation) {
    return { valid: false, error: 'Les mots de passe ne correspondent pas' };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un nom (entreprise, personne, etc.)
 */
export const validateName = (name, fieldName = 'nom') => {
  if (!name || name.trim() === '') {
    return { valid: false, error: `Le ${fieldName} est requis` };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: `Le ${fieldName} doit contenir au moins 2 caractères` };
  }
  
  if (name.length > 100) {
    return { valid: false, error: `Le ${fieldName} ne peut pas dépasser 100 caractères` };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un numéro de téléphone
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { valid: false, error: 'Le numéro de téléphone est requis' };
  }
  
  // Accepte formats: +32 123 45 67 89, 0123456789, +32123456789, etc.
  const phoneRegex = /^[\d\s+()-]{9,20}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'Format de téléphone invalide' };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide une URL
 */
export const validateUrl = (url, required = false) => {
  if (!url || url.trim() === '') {
    if (required) {
      return { valid: false, error: 'L\'URL est requise' };
    }
    return { valid: true, error: null };
  }
  
  try {
    new URL(url);
    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: 'Format d\'URL invalide' };
  }
};

/**
 * Valide une sélection dans une liste
 */
export const validateSelect = (value, options, fieldName = 'champ') => {
  if (!value || value.trim() === '') {
    return { valid: false, error: `Veuillez sélectionner un ${fieldName}` };
  }
  
  if (options && !options.includes(value)) {
    return { valid: false, error: `Valeur invalide pour ${fieldName}` };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un nombre
 */
export const validateNumber = (value, min = null, max = null, fieldName = 'nombre') => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `Le ${fieldName} est requis` };
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: `Le ${fieldName} doit être un nombre valide` };
  }
  
  if (min !== null && num < min) {
    return { valid: false, error: `Le ${fieldName} doit être supérieur ou égal à ${min}` };
  }
  
  if (max !== null && num > max) {
    return { valid: false, error: `Le ${fieldName} doit être inférieur ou égal à ${max}` };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide une date
 */
export const validateDate = (dateValue, isFuture = false, fieldName = 'date') => {
  if (!dateValue) {
    return { valid: false, error: `La ${fieldName} est requise` };
  }
  
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) {
    return { valid: false, error: `Format de ${fieldName} invalide` };
  }
  
  if (isFuture && date < new Date()) {
    return { valid: false, error: `La ${fieldName} doit être dans le futur` };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un horaire (format HH:MM)
 */
export const validateTime = (time, fieldName = 'horaire') => {
  if (!time || time.trim() === '') {
    return { valid: false, error: `L'${fieldName} est requis` };
  }
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return { valid: false, error: `Format d'${fieldName} invalide (HH:MM)` };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un tableau (ex: technologies, compétences)
 */
export const validateArray = (array, minLength = 1, fieldName = 'éléments') => {
  if (!array || !Array.isArray(array)) {
    return { valid: false, error: `Les ${fieldName} sont requis` };
  }
  
  if (array.length < minLength) {
    return { valid: false, error: `Veuillez sélectionner au moins ${minLength} ${fieldName}` };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un texte avec longueur min/max
 */
export const validateText = (text, minLength = 1, maxLength = 5000, fieldName = 'texte') => {
  if (!text || text.trim() === '') {
    return { valid: false, error: `Le ${fieldName} est requis` };
  }
  
  const trimmedLength = text.trim().length;
  
  if (trimmedLength < minLength) {
    return { valid: false, error: `Le ${fieldName} doit contenir au moins ${minLength} caractères` };
  }
  
  if (trimmedLength > maxLength) {
    return { valid: false, error: `Le ${fieldName} ne peut pas dépasser ${maxLength} caractères` };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un fichier uploadé
 */
export const validateFile = (file, allowedTypes = [], maxSizeMB = 5) => {
  if (!file) {
    return { valid: false, error: 'Veuillez sélectionner un fichier' };
  }
  
  // Vérifier le type de fichier
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}` 
    };
  }
  
  // Vérifier la taille
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `Le fichier est trop volumineux. Taille maximale: ${maxSizeMB}MB` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide une image
 */
export const validateImage = (file, maxSizeMB = 5) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validateFile(file, allowedTypes, maxSizeMB);
};

/**
 * Valide un score (0-100)
 */
export const validateScore = (score) => {
  return validateNumber(score, 0, 100, 'score');
};

/**
 * Valide des années d'expérience
 */
export const validateExperience = (years) => {
  return validateNumber(years, 0, 50, 'années d\'expérience');
};

/**
 * Fonction helper pour valider tout un formulaire
 * Retourne { isValid: boolean, errors: {} }
 */
export const validateForm = (fields, validators) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validators).forEach(fieldName => {
    const validator = validators[fieldName];
    const fieldValue = fields[fieldName];
    
    const result = validator(fieldValue);
    if (!result.valid) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

/**
 * Validation en temps réel - debounced
 * Utilisé pour valider pendant que l'utilisateur tape
 */
export const createDebouncedValidator = (validator, delay = 300) => {
  let timeoutId = null;
  
  return (value, callback) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      const result = validator(value);
      callback(result);
    }, delay);
  };
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
  validatePhone,
  validateUrl,
  validateSelect,
  validateNumber,
  validateDate,
  validateTime,
  validateArray,
  validateText,
  validateFile,
  validateImage,
  validateScore,
  validateExperience,
  validateForm,
  createDebouncedValidator,
};

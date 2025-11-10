// ========================================
// TECHNOLOGIES
// ========================================

// Liste des technologies disponibles pour les talents
export const TECHNOLOGIES = [
  'React.js',
  'Vue.js',
  'Angular',
  'Svelte',
  'Next.js',
  'Nuxt.js',
  'Node.js',
  'Express',
  'NestJS',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Python',
  'Django',
  'Flask',
  'FastAPI',
  'PHP',
  'Laravel',
  'Symfony',
  'Java',
  'Spring Boot',
  'C#',
  '.NET',
  'JavaScript',
  'TypeScript',
  'HTML/CSS',
  'Tailwind CSS',
  'Bootstrap',
  'Material-UI',
  'Sass/SCSS',
  'Git',
  'GitHub',
  'GitLab',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Google Cloud',
  'Firebase',
  'Heroku',
  'Vercel',
  'GraphQL',
  'REST API',
  'Socket.io',
  'Jest',
  'Cypress',
  'Selenium',
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',
  'Xamarin',
];

// ========================================
// TALENTS - PROFILS & NIVEAUX
// ========================================

// Types de profils
export const PROFIL_TYPES = [
  'Frontend',
  'Backend',
  'Full-stack',
  'Mobile',
  'DevOps',
  'Data',
];

// Niveaux d'expérience
export const NIVEAUX = [
  'Junior',
  'Medior',
  'Senior',
];

// Types de contrats
export const TYPES_CONTRAT = [
  'CDI',
  'CDD',
  'Freelance',
  'Stage',
  'Alternance',
];

// Disponibilités
export const DISPONIBILITES = [
  'Immédiate',
  '1-2 semaines',
  '1 mois',
  'Non disponible',
];

// Langues
export const LANGUES = [
  'Français',
  'Anglais',
  'Néerlandais',
  'Allemand',
  'Espagnol',
  'Italien',
  'Portugais',
  'Arabe',
  'Chinois',
];

// Statuts des talents
export const STATUTS_TALENT = [
  'actif',
  'inactif',
  'en_mission',
];

// ========================================
// PLATEFORMES & TESTS
// ========================================

// Plateformes de test
export const TEST_PLATFORMS = [
  'Codingame',
  'HackerRank',
  'LeetCode',
  'CodeWars',
  'Autre',
];

// ========================================
// ENTREPRISES
// ========================================

// Tailles d'entreprise
export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '500+',
];

// ========================================
// COULEURS - BADGES
// ========================================

// Couleurs pour les badges de technologies
export const TECH_COLORS = {
  // Frontend Frameworks
  'React.js': 'bg-blue-100 text-blue-700',
  'Vue.js': 'bg-green-100 text-green-700',
  'Angular': 'bg-red-100 text-red-700',
  'Svelte': 'bg-orange-100 text-orange-700',
  'Next.js': 'bg-gray-800 text-white',
  'Nuxt.js': 'bg-green-100 text-green-700',
  
  // Backend
  'Node.js': 'bg-green-100 text-green-800',
  'Express': 'bg-gray-100 text-gray-700',
  'NestJS': 'bg-red-100 text-red-700',
  'Python': 'bg-yellow-100 text-yellow-700',
  'Django': 'bg-green-100 text-green-700',
  'Flask': 'bg-gray-100 text-gray-700',
  'FastAPI': 'bg-teal-100 text-teal-700',
  'PHP': 'bg-purple-100 text-purple-700',
  'Laravel': 'bg-red-100 text-red-700',
  'Symfony': 'bg-gray-100 text-gray-700',
  'Java': 'bg-orange-100 text-orange-700',
  'Spring Boot': 'bg-green-100 text-green-700',
  'C#': 'bg-purple-100 text-purple-700',
  '.NET': 'bg-purple-100 text-purple-700',
  
  // Languages
  'JavaScript': 'bg-yellow-100 text-yellow-700',
  'TypeScript': 'bg-blue-100 text-blue-700',
  'HTML/CSS': 'bg-orange-100 text-orange-700',
  
  // CSS Frameworks
  'Tailwind CSS': 'bg-cyan-100 text-cyan-700',
  'Bootstrap': 'bg-purple-100 text-purple-700',
  'Material-UI': 'bg-blue-100 text-blue-700',
  'Sass/SCSS': 'bg-pink-100 text-pink-700',
  
  // Databases
  'MongoDB': 'bg-green-100 text-green-700',
  'PostgreSQL': 'bg-blue-100 text-blue-700',
  'MySQL': 'bg-blue-100 text-blue-700',
  'Redis': 'bg-red-100 text-red-700',
  
  // DevOps & Cloud
  'Git': 'bg-orange-100 text-orange-700',
  'GitHub': 'bg-gray-800 text-white',
  'GitLab': 'bg-orange-100 text-orange-700',
  'Docker': 'bg-blue-100 text-blue-700',
  'Kubernetes': 'bg-blue-100 text-blue-700',
  'AWS': 'bg-orange-100 text-orange-700',
  'Azure': 'bg-blue-100 text-blue-700',
  'Google Cloud': 'bg-blue-100 text-blue-700',
  'Firebase': 'bg-yellow-100 text-yellow-700',
  'Heroku': 'bg-purple-100 text-purple-700',
  'Vercel': 'bg-gray-800 text-white',
  
  // APIs & Testing
  'GraphQL': 'bg-pink-100 text-pink-700',
  'REST API': 'bg-green-100 text-green-700',
  'Socket.io': 'bg-gray-100 text-gray-700',
  'Jest': 'bg-red-100 text-red-700',
  'Cypress': 'bg-green-100 text-green-700',
  'Selenium': 'bg-green-100 text-green-700',
  
  // Mobile
  'React Native': 'bg-blue-100 text-blue-700',
  'Flutter': 'bg-blue-100 text-blue-700',
  'Swift': 'bg-orange-100 text-orange-700',
  'Kotlin': 'bg-purple-100 text-purple-700',
  'Xamarin': 'bg-blue-100 text-blue-700',
  
  // Default
  'default': 'bg-gray-100 text-gray-700',
};

// Couleurs pour badges de niveau
export const NIVEAU_COLORS = {
  'Junior': 'bg-green-100 text-green-700 border-green-200',
  'Medior': 'bg-blue-100 text-blue-700 border-blue-200',
  'Senior': 'bg-purple-100 text-purple-700 border-purple-200',
};

// Couleurs pour types de contrat
export const CONTRAT_COLORS = {
  'CDI': 'bg-blue-100 text-blue-700 border-blue-200',
  'CDD': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Freelance': 'bg-purple-100 text-purple-700 border-purple-200',
  'Stage': 'bg-green-100 text-green-700 border-green-200',
  'Alternance': 'bg-orange-100 text-orange-700 border-orange-200',
};

// Couleurs pour types de profils
export const PROFIL_COLORS = {
  'Frontend': 'bg-blue-100 text-blue-700 border-blue-200',
  'Backend': 'bg-green-100 text-green-700 border-green-200',
  'Full-stack': 'bg-purple-100 text-purple-700 border-purple-200',
  'Mobile': 'bg-pink-100 text-pink-700 border-pink-200',
  'DevOps': 'bg-orange-100 text-orange-700 border-orange-200',
  'Data': 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

// Couleurs pour disponibilités
export const DISPONIBILITE_COLORS = {
  'Immédiate': 'bg-green-100 text-green-700 border-green-200',
  '1-2 semaines': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '1 mois': 'bg-orange-100 text-orange-700 border-orange-200',
  'Non disponible': 'bg-red-100 text-red-700 border-red-200',
};

// Couleurs pour statuts
export const STATUT_COLORS = {
  'actif': 'bg-green-100 text-green-700 border-green-200',
  'inactif': 'bg-gray-100 text-gray-700 border-gray-200',
  'en_mission': 'bg-blue-100 text-blue-700 border-blue-200',
};

// ========================================
// VALIDATION
// ========================================

// Messages de validation
export const VALIDATION_MESSAGES = {
  required: 'Ce champ est requis',
  email: 'Email invalide',
  minLength: (min) => `Minimum ${min} caractères`,
  maxLength: (max) => `Maximum ${max} caractères`,
  passwordStrength: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
  phoneFormat: 'Format de téléphone invalide',
  urlFormat: 'URL invalide',
  numberRange: (min, max) => `La valeur doit être entre ${min} et ${max}`,
};

// ========================================
// HELPERS
// ========================================

// Fonction helper pour obtenir la couleur d'un badge
export const getBadgeColor = (type, value) => {
  const colorMaps = {
    tech: TECH_COLORS,
    niveau: NIVEAU_COLORS,
    contrat: CONTRAT_COLORS,
    profil: PROFIL_COLORS,
    disponibilite: DISPONIBILITE_COLORS,
    statut: STATUT_COLORS,
  };
  
  return colorMaps[type]?.[value] || colorMaps[type]?.default || 'bg-gray-100 text-gray-700';
};

// Fonction pour formater les années d'expérience
export const formatExperience = (years) => {
  if (years === 0) return 'Débutant';
  if (years === 1) return '1 an d\'expérience';
  return `${years} ans d\'expérience`;
};

// Fonction pour formater le tarif
export const formatTarif = (tarif) => {
  if (!tarif) return 'Non spécifié';
  return `${tarif}€/jour`;
};
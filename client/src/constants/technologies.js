/**
 * Liste centralisée de toutes les technologies disponibles dans TalentProof
 * Cette liste est utilisée partout dans l'application : profils, recherche, Talent Days, etc.
 * 
 * IMPORTANT: C'est la SEULE source de vérité pour les technologies.
 * Ne créez pas de nouvelles listes ailleurs.
 */

export const TECHNOLOGIES = [
  // Langages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "C++",
  
  // Frontend
  "React",
  "Vue.js",
  "Angular",
  "Next.js",
  "Nuxt.js",
  "Svelte",
  "HTML/CSS",
  "Tailwind CSS",
  "Bootstrap",
  "Material-UI",
  "Sass/SCSS",
  
  // Backend
  "Node.js",
  "Express.js",
  "NestJS",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Laravel",
  ".NET Core",
  "Ruby on Rails",
  
  // Mobile
  "React Native",
  "Flutter",
  "Swift/SwiftUI",
  "Kotlin/Android",
  "Ionic",
  
  // Databases
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Firebase",
  "SQL Server",
  "Oracle",
  "Elasticsearch",
  
  // Cloud & DevOps
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI/CD",
  "Terraform",
  
  // Outils
  "Git",
  "GraphQL",
  "REST API",
  "Webpack",
  "Vite",
  "Jest",
  "Cypress",
  "Redux",
  "Prisma",
  "Stripe"
];

/**
 * Couleurs des badges par défaut pour les technologies
 * Ces couleurs peuvent être utilisées pour l'affichage des badges
 */
export const TECH_COLORS = {
  // Langages
  'JavaScript': 'bg-yellow-100 text-yellow-700',
  'TypeScript': 'bg-blue-100 text-blue-700',
  'Python': 'bg-blue-200 text-blue-800',
  'Java': 'bg-red-100 text-red-700',
  'C#': 'bg-purple-100 text-purple-700',
  'PHP': 'bg-indigo-100 text-indigo-700',
  'Ruby': 'bg-red-100 text-red-800',
  'Go': 'bg-cyan-100 text-cyan-700',
  'Rust': 'bg-orange-100 text-orange-700',
  'Kotlin': 'bg-purple-100 text-purple-700',
  'Swift': 'bg-orange-100 text-orange-800',
  'C++': 'bg-blue-100 text-blue-800',
  
  // Frontend
  'React': 'bg-blue-100 text-blue-700',
  'Vue.js': 'bg-green-100 text-green-700',
  'Angular': 'bg-red-100 text-red-700',
  'Next.js': 'bg-gray-800 text-white',
  'Nuxt.js': 'bg-green-100 text-green-800',
  'Svelte': 'bg-orange-100 text-orange-700',
  'HTML/CSS': 'bg-orange-100 text-orange-600',
  'Tailwind CSS': 'bg-cyan-100 text-cyan-700',
  'Bootstrap': 'bg-purple-100 text-purple-700',
  'Material-UI': 'bg-blue-100 text-blue-600',
  'Sass/SCSS': 'bg-pink-100 text-pink-700',
  
  // Backend
  'Node.js': 'bg-green-100 text-green-800',
  'Express.js': 'bg-gray-100 text-gray-800',
  'NestJS': 'bg-red-100 text-red-700',
  'Django': 'bg-green-100 text-green-800',
  'Flask': 'bg-gray-100 text-gray-700',
  'FastAPI': 'bg-teal-100 text-teal-700',
  'Spring Boot': 'bg-green-100 text-green-700',
  'Laravel': 'bg-red-100 text-red-700',
  '.NET Core': 'bg-purple-100 text-purple-700',
  'Ruby on Rails': 'bg-red-100 text-red-800',
  
  // Mobile
  'React Native': 'bg-blue-100 text-blue-600',
  'Flutter': 'bg-blue-100 text-blue-700',
  'Swift/SwiftUI': 'bg-orange-100 text-orange-700',
  'Kotlin/Android': 'bg-green-100 text-green-700',
  'Ionic': 'bg-blue-100 text-blue-600',
  
  // Databases
  'MongoDB': 'bg-green-100 text-green-700',
  'PostgreSQL': 'bg-blue-100 text-blue-700',
  'MySQL': 'bg-blue-100 text-blue-800',
  'Redis': 'bg-red-100 text-red-700',
  'Firebase': 'bg-yellow-100 text-yellow-700',
  'SQL Server': 'bg-red-100 text-red-800',
  'Oracle': 'bg-red-100 text-red-700',
  'Elasticsearch': 'bg-teal-100 text-teal-700',
  
  // Cloud & DevOps
  'AWS': 'bg-orange-100 text-orange-700',
  'Azure': 'bg-blue-100 text-blue-700',
  'Google Cloud': 'bg-blue-100 text-blue-600',
  'Docker': 'bg-blue-100 text-blue-700',
  'Kubernetes': 'bg-blue-100 text-blue-800',
  'Jenkins': 'bg-red-100 text-red-700',
  'GitHub Actions': 'bg-gray-800 text-white',
  'GitLab CI/CD': 'bg-orange-100 text-orange-700',
  'Terraform': 'bg-purple-100 text-purple-700',
  
  // Outils
  'Git': 'bg-orange-100 text-orange-700',
  'GraphQL': 'bg-pink-100 text-pink-700',
  'REST API': 'bg-green-100 text-green-700',
  'Webpack': 'bg-blue-100 text-blue-700',
  'Vite': 'bg-purple-100 text-purple-700',
  'Jest': 'bg-red-100 text-red-700',
  'Cypress': 'bg-gray-100 text-gray-700',
  'Redux': 'bg-purple-100 text-purple-700',
  'Prisma': 'bg-gray-800 text-white',
  'Stripe': 'bg-purple-100 text-purple-700',
  
  // Couleur par défaut
  'default': 'bg-gray-100 text-gray-700',
};

/**
 * Fonction utilitaire pour obtenir la couleur d'un badge de technologie
 * @param {string} tech - Le nom de la technologie
 * @returns {string} - Classes CSS Tailwind pour le badge
 */
export const getTechBadgeColor = (tech) => {
  return TECH_COLORS[tech] || TECH_COLORS['default'];
};

export default TECHNOLOGIES;

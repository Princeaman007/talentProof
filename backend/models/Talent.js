import mongoose from 'mongoose';

const talentSchema = new mongoose.Schema({
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
  },
  photo: {
    type: String,
    default: null,
  },
  
  // ✅ NOUVEAU - Type de profil
  typeProfil: {
    type: String,
    required: [true, 'Le type de profil est requis'],
    enum: ['Frontend', 'Backend', 'Full-stack', 'Mobile', 'DevOps', 'Data'],
    default: 'Full-stack',
  },
  
  // ✅ NOUVEAU - Niveau d'expérience
  niveau: {
    type: String,
    required: [true, 'Le niveau est requis'],
    enum: ['Junior', 'Medior', 'Senior'],
    default: 'Junior',
  },
  
  // ✅ NOUVEAU - Type de contrat
  typeContrat: {
    type: String,
    required: [true, 'Le type de contrat est requis'],
    enum: ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'],
    default: 'CDI',
  },
  
  // ✅ AMÉLIORÉ - Années d'expérience (nombre)
  anneesExperience: {
    type: Number,
    required: [true, 'Les années d\'expérience sont requises'],
    min: [0, 'Les années d\'expérience doivent être supérieures ou égales à 0'],
    max: [50, 'Les années d\'expérience doivent être inférieures à 50'],
    default: 0,
  },
  
  technologies: [{
    type: String,
    required: true,
  }],
  
  competences: {
    type: String,
    required: [true, 'Les compétences sont requises'],
  },
  
  scoreTest: {
    type: Number,
    required: [true, 'Le score du test est requis'],
    min: [0, 'Le score doit être entre 0 et 100'],
    max: [100, 'Le score doit être entre 0 et 100'],
  },
  
  plateforme: {
    type: String,
    required: [true, 'La plateforme de test est requise'],
    enum: ['Codingame', 'HackerRank', 'LeetCode', 'CodeWars', 'Autre'],
  },
  
  // ✅ NOUVEAU - Disponibilité
  disponibilite: {
    type: String,
    enum: ['Immédiate', '1-2 semaines', '1 mois', 'Non disponible'],
    default: 'Immédiate',
  },
  
  // ✅ NOUVEAU - Localisation
  localisation: {
    type: String,
    trim: true,
    default: 'Belgique',
  },
  
  // ✅ NOUVEAU - Langues parlées
  langues: [{
    type: String,
    default: ['Français'],
  }],
  
  // ✅ NOUVEAU - Tarif journalier (pour freelances)
  tarifJournalier: {
    type: Number,
    min: 0,
    default: null,
  },
  
  // ✅ NOUVEAU - Portfolio / GitHub
  portfolio: {
    type: String,
    trim: true,
    default: null,
  },
  
  github: {
    type: String,
    trim: true,
    default: null,
  },
  
  linkedin: {
    type: String,
    trim: true,
    default: null,
  },
  
  statut: {
    type: String,
    enum: ['actif', 'inactif', 'en_mission'],
    default: 'actif',
  },
  
}, {
  timestamps: true,
});

// Index pour optimiser les recherches
talentSchema.index({ statut: 1 });
talentSchema.index({ technologies: 1 });
talentSchema.index({ typeProfil: 1 });
talentSchema.index({ niveau: 1 });
talentSchema.index({ typeContrat: 1 });
talentSchema.index({ disponibilite: 1 });

// Méthode virtuelle pour afficher l'expérience de manière lisible
talentSchema.virtual('experienceText').get(function() {
  if (this.anneesExperience === 0) {
    return 'Débutant';
  } else if (this.anneesExperience === 1) {
    return '1 an d\'expérience';
  } else {
    return `${this.anneesExperience} ans d\'expérience`;
  }
});

// S'assurer que les virtuals sont inclus dans toJSON
talentSchema.set('toJSON', { virtuals: true });
talentSchema.set('toObject', { virtuals: true });

const Talent = mongoose.model('Talent', talentSchema);

export default Talent;
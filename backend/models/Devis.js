import mongoose from 'mongoose';

const devisSchema = new mongoose.Schema({
  // Informations client
  nomComplet: {
    type: String,
    required: [true, 'Le nom complet est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    trim: true,
    lowercase: true
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true
  },
  entreprise: {
    type: String,
    trim: true
  },
  
  // Détails du projet
  typeProjet: {
    type: String,
    enum: [
      'site-vitrine',
      'site-e-commerce',
      'application-mobile',
      'application-web',
      'refonte-site',
      'maintenance',
      'autre'
    ],
    required: [true, 'Le type de projet est requis']
  },
  description: {
    type: String,
    required: [true, 'La description du projet est requise'],
    trim: true
  },
  
  // Fonctionnalités souhaitées
  fonctionnalites: [{
    type: String
  }],
  
  // Budget et délais
  budgetEstime: {
    type: String,
    enum: [
      'moins-5000',
      '5000-10000',
      '10000-20000',
      '20000-50000',
      'plus-50000',
      'a-discuter'
    ]
  },
  delaiSouhaite: {
    type: String,
    enum: [
      'urgent', // < 1 mois
      'court-terme', // 1-2 mois
      'moyen-terme', // 3-6 mois
      'long-terme', // > 6 mois
      'flexible'
    ]
  },
  
  // Fichiers attachés (optionnel)
  fichiers: [{
    nom: String,
    url: String,
    type: String
  }],
  
  // Statut de la demande
  statut: {
    type: String,
    enum: ['nouveau', 'en-cours', 'devis-envoye', 'accepte', 'refuse', 'archive'],
    default: 'nouveau'
  },
  
  // Notes internes (admin uniquement)
  notesInternes: {
    type: String,
    trim: true
  },
  
  // Devis envoyé
  devisEnvoye: {
    date: Date,
    montant: Number,
    fichier: String
  },
  
  // Source
  source: {
    type: String,
    enum: ['site-web', 'email', 'telephone', 'autre'],
    default: 'site-web'
  },
  
  // Priorité (définie par admin)
  priorite: {
    type: String,
    enum: ['basse', 'normale', 'haute', 'urgente'],
    default: 'normale'
  }
}, {
  timestamps: true
});

// Index pour recherche
devisSchema.index({ email: 1 });
devisSchema.index({ statut: 1, createdAt: -1 });
devisSchema.index({ typeProjet: 1 });

const Devis = mongoose.model('Devis', devisSchema);

export default Devis;
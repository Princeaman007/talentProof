import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre du projet est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  descriptionLongue: {
    type: String,
    trim: true
  },
  client: {
    type: String,
    trim: true
  },
  screenshot: {
    type: String, // URL de l'image principale
    required: [true, 'Le screenshot est requis']
  },
  images: [{
    type: String // URLs des images supplémentaires
  }],
  technologies: [{
    type: String,
    required: true
  }],
  categorie: {
    type: String,
    enum: ['site-vitrine', 'e-commerce', 'app-mobile', 'app-web', 'dashboard', 'autre'],
    required: [true, 'La catégorie est requise']
  },
  url: {
    type: String, // URL du site/projet si disponible
    trim: true
  },
  dateRealisation: {
    type: Date,
    default: Date.now
  },
  duree: {
    type: String, // Ex: "2 mois", "3 semaines"
    trim: true
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif', 'archive'],
    default: 'actif'
  },
  ordre: {
    type: Number,
    default: 0 // Pour l'ordre d'affichage
  },
  featured: {
    type: Boolean,
    default: false // Projets mis en avant
  },
  vues: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour recherche et tri
portfolioSchema.index({ titre: 'text', description: 'text' });
portfolioSchema.index({ categorie: 1, statut: 1 });
portfolioSchema.index({ ordre: 1, createdAt: -1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
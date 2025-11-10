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
    min: 0,
    max: 100,
  },
  plateforme: {
    type: String,
    required: [true, 'La plateforme de test est requise'],
    enum: ['Codingame', 'HackerRank', 'LeetCode', 'CodeWars', 'Autre'],
  },
  anneeExperience: {
    type: String,
    required: [true, 'L\'année d\'expérience/formation est requise'],
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif',
  },
}, {
  timestamps: true,
});

// Index pour filtrage par statut et technologies
talentSchema.index({ statut: 1 });
talentSchema.index({ technologies: 1 });

const Talent = mongoose.model('Talent', talentSchema);

export default Talent;
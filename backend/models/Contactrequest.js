import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema({
  talent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Talent',
    required: true,
  },
  recruteurNom: {
    type: String,
    required: [true, 'Le nom du recruteur est requis'],
    trim: true,
  },
  recruteurEmail: {
    type: String,
    required: [true, 'L\'email du recruteur est requis'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
  },
  recruteurTel: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true,
  },
  entreprise: {
    type: String,
    required: [true, 'Le nom de l\'entreprise est requis'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Le message est requis'],
  },
  statut: {
    type: String,
    enum: ['nouveau', 'traité'],
    default: 'nouveau',
  },
}, {
  timestamps: true,
});

// Index pour recherche et tri
contactRequestSchema.index({ statut: 1, createdAt: -1 });
contactRequestSchema.index({ talent: 1 });

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);

export default ContactRequest;
import mongoose from 'mongoose';

const favorisSchema = new mongoose.Schema({
  entreprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'L\'entreprise est requise'],
  },
  talent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Talent',
    required: [true, 'Le talent est requis'],
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, 'La note ne peut pas dépasser 500 caractères'],
    default: null,
  },
}, {
  timestamps: true,
});

// Index pour éviter les doublons et optimiser les recherches
favorisSchema.index({ entreprise: 1, talent: 1 }, { unique: true });
favorisSchema.index({ entreprise: 1, createdAt: -1 });

const Favoris = mongoose.model('Favoris', favorisSchema);

export default Favoris;
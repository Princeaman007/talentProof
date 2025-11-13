import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  entreprise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'L\'entreprise est requise'],
  },
  type: {
    type: String,
    enum: ['nouveau_talent', 'demande_traitee', 'devis_repondu', 'system'],
    required: [true, 'Le type de notification est requis'],
  },
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
  },
  message: {
    type: String,
    required: [true, 'Le message est requis'],
    maxlength: [500, 'Le message ne peut pas dépasser 500 caractères'],
  },
  lien: {
    type: String,
    trim: true,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Index pour optimiser les requêtes
notificationSchema.index({ entreprise: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ entreprise: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
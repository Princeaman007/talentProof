import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de l\'entreprise est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false,
  },
  logo: {
    type: String,
    default: null,
  },
  telephone: {
    type: String,
    default: null,
    trim: true,
  },
  adresse: {
    type: String,
    default: null,
    trim: true,
  },
  secteurActivite: {
    type: String,
    default: null,
    trim: true,
  },
  nombreEmployes: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    default: '1-10',
  },
  profilsRecherches: [{
    type: String,
  }],
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  confirmationToken: {
    type: String,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  // Refresh token hashed (pour rotation / invalidation)
  refreshToken: {
    type: String,
    default: null,
    select: false,
  },
  refreshTokenExpires: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    enum: ['entreprise', 'admin'],
    default: 'entreprise',
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  suspendedAt: {
    type: Date,
    default: null,
  },
  suspensionReason: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// ✅ SUPPRIMÉ - companySchema.index({ email: 1 }); (doublon avec unique: true)

// INDEX - PHASE 4
companySchema.index({ role: 1 });
companySchema.index({ isActive: 1 });
companySchema.index({ createdAt: -1 });
// Index pour les refresh tokens (recherche rapide lors de rotation)
companySchema.index({ refreshToken: 1 }, { partialFilterExpression: { refreshToken: { $exists: true } } });
companySchema.index({ refreshTokenExpires: 1 }, { partialFilterExpression: { refreshTokenExpires: { $exists: true } } });

// ✅ Protection contre OverwriteModelError
const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;

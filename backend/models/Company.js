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
    select: false, // Ne pas retourner le password par défaut
  },
  logo: {
    type: String,
    default: null,
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
}, {
  timestamps: true,
});

// Index pour recherche rapide par email
companySchema.index({ email: 1 });

const Company = mongoose.model('Company', companySchema);

export default Company;
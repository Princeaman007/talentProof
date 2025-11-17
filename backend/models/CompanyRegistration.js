import mongoose from 'mongoose';

const companyRegistrationSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Le nom de l\'entreprise est requis'],
    trim: true,
    maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères'],
  },
  contactPerson: {
    type: String,
    required: [true, 'Le nom du contact est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Format d\'email invalide'],
  },
  phone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  interestedTalentDays: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TalentDay',
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  meetingRequests: [{
    talent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Talent',
    },
    talentDay: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TalentDay',
    },
    proposedDate: Date,
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Index pour recherche et performance
companyRegistrationSchema.index({ email: 1 });
companyRegistrationSchema.index({ status: 1 });
companyRegistrationSchema.index({ createdAt: -1 });

// Méthode pour vérifier si l'entreprise peut réserver
companyRegistrationSchema.methods.canBook = function() {
  return this.status === 'confirmed';
};

// Virtual pour le nombre de meetings demandés
companyRegistrationSchema.virtual('meetingCount').get(function() {
  return this.meetingRequests?.length || 0;
});

// Inclure les virtuals dans le JSON
companyRegistrationSchema.set('toJSON', { virtuals: true });
companyRegistrationSchema.set('toObject', { virtuals: true });

const CompanyRegistration = mongoose.models.CompanyRegistration || mongoose.model('CompanyRegistration', companyRegistrationSchema);

export default CompanyRegistration;

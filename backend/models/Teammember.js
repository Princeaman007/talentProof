import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  photo: {
    type: String,
    required: [true, 'La photo est requise'],
  },
  position: {
    type: String,
    required: [true, 'La position est requise'],
    trim: true,
  },
  specialite: {
    type: String,
    required: [true, 'La spécialité est requise'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  linkedIn: {
    type: String,
    default: null,
  },
  twitter: {
    type: String,
    default: null,
  },
  ordre: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index pour l'ordre d'affichage
teamMemberSchema.index({ ordre: 1 });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
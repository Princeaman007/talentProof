import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
  },
  photo: {
    type: String,
    default: null,
  },
  poste: {
    type: String,
    required: [true, 'Le poste est requis'],
    trim: true,
  },
  bio: {
    type: String,
    required: [true, 'La biographie est requise'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: null,
  },
  linkedin: {
    type: String,
    trim: true,
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
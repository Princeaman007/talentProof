import mongoose from 'mongoose';

const talentDaySchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères'],
  },
  date: {
    type: Date,
    required: [true, 'La date est requise'],
  },
  heureDebut: {
    type: String,
    required: [true, 'L\'heure de début est requise'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format heure invalide (HH:MM)'],
  },
  heureFin: {
    type: String,
    required: [true, 'L\'heure de fin est requise'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format heure invalide (HH:MM)'],
  },
lieu: {
  type: {
    type: String,
    enum: ['physique', 'en-ligne', 'hybride'],
    required: true,
  },
  adresse: {
    type: String,
    default: '',
  },
  ville: {
    type: String,
    default: '',
  },
  lienVirtuel: {
    type: String,
    default: '',
  },
},
  technologies: [{
    type: String,
    trim: true,
  }],
  niveauRequis: {
    type: String,
    enum: ['debutant', 'intermediaire', 'avance', 'tous-niveaux'],
    default: 'tous-niveaux',
  },
  placesDisponibles: {
    type: Number,
    required: [true, 'Le nombre de places est requis'],
    min: [1, 'Il doit y avoir au moins 1 place'],
    max: [100, 'Maximum 100 places'],
  },
  placesRestantes: {
    type: Number,
    default: function() {
      return this.placesDisponibles || 0;
    },
  },
  image: {
    type: String,
    default: '/uploads/default-talent-day.svg',
  },
  statut: {
    type: String,
    enum: ['a-venir', 'inscriptions-ouvertes', 'complet', 'en-cours', 'termine', 'annule'],
    default: 'a-venir',
  },
  typeEvenement: {
    type: String,
    enum: ['hackathon', 'workshop', 'challenge-code', 'portfolio-day', 'entretien-groupe', 'autre'],
    required: [true, 'Le type d\'événement est requis'],
  },
  organisateur: {
    nom: {
      type: String,
      default: 'TalentProof',
    },
    email: {
      type: String,
      default: 'info@princeaman.dev',
    },
    telephone: {
      type: String,
      default: '+32 467 62 08 78',
    },
  },
  partenaires: [{
    nom: String,
    logo: String,
    url: String,
  }],
  programme: [{
    heure: String,
    activite: String,
    description: String,
  }],
  prerequis: [{
    type: String,
  }],
  avantages: [{
    type: String,
  }],
  // Section dédiée aux entreprises
  infoEntreprises: {
    titre: {
      type: String,
      default: 'Pourquoi participer en tant qu\'entreprise ?',
    },
    description: {
      type: String,
      default: '',
    },
    avantages: [{
      type: String,
    }],
    profils: [{
      type: String,
    }],
    formats: [{
      nom: String,
      description: String,
      duree: String,
    }],
    tarif: {
      type: String,
      default: 'Gratuit',
    },
    placesEntreprises: {
      type: Number,
      default: 10,
    },
    contact: {
      nom: String,
      email: String,
      telephone: String,
    },
  },
  inscriptions: [{
    nom: String,
    email: String,
    telephone: String,
    motivation: String,
    dateInscription: {
      type: Date,
      default: Date.now,
    },
    statut: {
      type: String,
      enum: ['en-attente', 'accepte', 'refuse', 'liste-attente'],
      default: 'en-attente',
    },
  }],
  resultats: {
    nombreParticipants: Number,
    talentsValides: Number,
    entreprisesPresentes: Number,
    photos: [String],
    temoignages: [{
      participant: String,
      commentaire: String,
      note: Number,
    }],
  },
  published: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index pour recherche et performance
talentDaySchema.index({ date: 1, statut: 1 });
talentDaySchema.index({ technologies: 1 });
talentDaySchema.index({ statut: 1, published: 1 });

// Méthode pour vérifier si l'événement est passé
talentDaySchema.methods.isPassed = function() {
  return new Date() > this.date;
};

// Méthode pour vérifier si les inscriptions sont ouvertes
talentDaySchema.methods.canRegister = function() {
  const placesRestantes = this.placesRestantes || this.placesDisponibles || 0;
  return (
    this.statut === 'inscriptions-ouvertes' &&
    placesRestantes > 0 &&
    !this.isPassed()
  );
};

// Méthode pour mettre à jour le statut automatiquement
talentDaySchema.methods.updateStatus = async function() {
  const now = new Date();
  const eventDate = new Date(this.date);
  
  if (now > eventDate) {
    this.statut = 'termine';
  } else if (this.placesRestantes === 0) {
    this.statut = 'complet';
  } else if (this.placesRestantes > 0 && this.statut === 'a-venir') {
    this.statut = 'inscriptions-ouvertes';
  }
  
  return this.save();
};

// Middleware pour initialiser placesRestantes
talentDaySchema.pre('save', function(next) {
  // For new documents
  if (this.isNew) {
    if (!this.placesRestantes) {
      this.placesRestantes = this.placesDisponibles;
    }
  } else {
    // For existing documents on update: ensure placesRestantes is always set
    if (!this.placesRestantes && this.placesDisponibles) {
      this.placesRestantes = this.placesDisponibles;
    }
  }
  next();
});

// Virtual pour formater la date
talentDaySchema.virtual('dateFormatee').get(function() {
  return this.date.toLocaleDateString('fr-BE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Virtual pour le taux de remplissage
talentDaySchema.virtual('tauxRemplissage').get(function() {
  return Math.round(((this.placesDisponibles - this.placesRestantes) / this.placesDisponibles) * 100);
});

// Inclure les virtuals dans le JSON
talentDaySchema.set('toJSON', { virtuals: true });
talentDaySchema.set('toObject', { virtuals: true });

const TalentDay = mongoose.models.TalentDay || mongoose.model('TalentDay', talentDaySchema);

export default TalentDay;
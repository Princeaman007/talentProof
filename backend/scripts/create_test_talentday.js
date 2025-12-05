import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

// Import models
import TalentDay from '../models/Talentday.js';

const createTestTalentDay = async () => {
  try {
    // Connexion MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env file');
    }
    await mongoose.connect(mongoUri);

    // Vérifier si des TalentDays existent déjà
    const existingCount = await TalentDay.countDocuments();

    if (existingCount > 0) {
      // Continue anyway for testing
    }

    // Créer 3 TalentDays de test
    const talentDays = [
      {
        titre: 'Tech Talent Day Brussels 2025',
        description: 'Rencontrez les meilleurs talents tech de Bruxelles. Une journée dédiée aux développeurs Full-stack, Frontend et Backend avec des ateliers pratiques et des sessions de networking.',
        date: new Date('2025-12-15'),
        heureDebut: '09:00',
        heureFin: '17:00',
        lieu: {
          type: 'physique',
          adresse: 'Brussels Expo',
          ville: 'Brussels'
        },
        placesDisponibles: 50,
        technologies: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
        image: 'default-talent-day.jpg',
        statut: 'inscriptions-ouvertes',
        typeEvenement: 'portfolio-day',
        niveauRequis: 'tous-niveaux'
      },
      {
        titre: 'Data & AI Talent Summit',
        description: 'Découvrez les talents en Data Science, Machine Learning et Intelligence Artificielle. Sessions techniques, démonstrations de projets et opportunités de recrutement.',
        date: new Date('2026-01-20'),
        heureDebut: '10:00',
        heureFin: '18:00',
        lieu: {
          type: 'hybride',
          adresse: 'Tour & Taxis',
          ville: 'Brussels',
          lienVirtuel: 'https://meet.google.com/abc-defg-hij'
        },
        placesDisponibles: 40,
        technologies: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'PowerBI'],
        image: 'default-talent-day.jpg',
        statut: 'inscriptions-ouvertes',
        typeEvenement: 'workshop',
        niveauRequis: 'intermediaire'
      },
      {
        titre: 'Mobile Dev Talent Day',
        description: 'Événement dédié aux développeurs mobile iOS, Android et cross-platform. Présentations de projets, workshops React Native et Flutter.',
        date: new Date('2026-02-10'),
        heureDebut: '09:30',
        heureFin: '16:30',
        lieu: {
          type: 'physique',
          adresse: 'The Egg Brussels',
          ville: 'Brussels'
        },
        placesDisponibles: 35,
        technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
        image: 'default-talent-day.jpg',
        statut: 'inscriptions-ouvertes',
        typeEvenement: 'challenge-code',
        niveauRequis: 'avance'
      }
    ];

    // Supprimer les anciens TalentDays de test (optionnel)
    // await TalentDay.deleteMany({ titre: { $in: talentDays.map(t => t.titre) } });

    // Insérer les TalentDays
    const created = await TalentDay.insertMany(talentDays);

    // Afficher les IDs créés
    created.forEach((td, index) => {
    });

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

createTestTalentDay();

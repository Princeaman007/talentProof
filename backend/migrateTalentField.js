import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script de migration pour renommer anneesExperience → anneeExperience
 * Exécuter avec: node migrateTalentField.js
 */

const migrateTalentField = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const db = mongoose.connection.db;
    const collection = db.collection('talents');

    // Renommer le champ anneesExperience → anneeExperience
    const result = await collection.updateMany(
      { anneesExperience: { $exists: true } },
      { $rename: { anneesExperience: 'anneeExperience' } }
    );

    
    // Vérifier le résultat
    const talentsWithOldField = await collection.countDocuments({ anneesExperience: { $exists: true } });
    const talentsWithNewField = await collection.countDocuments({ anneeExperience: { $exists: true } });
    

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

migrateTalentField();
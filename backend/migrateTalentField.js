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
    console.log(' Connecté à MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('talents');

    // Renommer le champ anneesExperience → anneeExperience
    const result = await collection.updateMany(
      { anneesExperience: { $exists: true } },
      { $rename: { anneesExperience: 'anneeExperience' } }
    );

    console.log(` Migration terminée: ${result.modifiedCount} talents mis à jour`);
    
    // Vérifier le résultat
    const talentsWithOldField = await collection.countDocuments({ anneesExperience: { $exists: true } });
    const talentsWithNewField = await collection.countDocuments({ anneeExperience: { $exists: true } });
    
    console.log(` Talents avec ancien champ (anneesExperience): ${talentsWithOldField}`);
    console.log(` Talents avec nouveau champ (anneeExperience): ${talentsWithNewField}`);

    await mongoose.connection.close();
    console.log(' Déconnecté de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error(' Erreur lors de la migration:', error);
    process.exit(1);
  }
};

migrateTalentField();
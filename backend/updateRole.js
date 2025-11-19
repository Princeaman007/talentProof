import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './models/Company.js';

dotenv.config();

const updateAdminRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connecté à MongoDB');

    // Mettre à jour le compte admin
    const result = await Company.updateOne(
      { email: 'info@princeaman.dev' },
      { 
        $set: { 
          role: 'admin',
          isActive: true,
          isConfirmed: true
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log(' Compte admin mis à jour avec role="admin"');
    } else {
      console.log(' Aucune modification (déjà à jour ou email introuvable)');
    }

    // Vérifier
    const admin = await Company.findOne({ email: 'info@princeaman.dev' });
    console.log(' Compte admin:', {
      email: admin.email,
      nom: admin.nom,
      role: admin.role,
      isActive: admin.isActive,
    });

    process.exit(0);
  } catch (error) {
    console.error(' Erreur:', error);
    process.exit(1);
  }
};

updateAdminRole();
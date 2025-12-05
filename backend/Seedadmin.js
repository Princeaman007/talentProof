import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Company from './models/Company.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Company.findOne({ email: 'info@princeaman.dev' });

    if (existingAdmin) {
      
      // Mettre à jour en admin si ce n'est pas le cas
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.isActive = true;
        existingAdmin.isConfirmed = true;
        await existingAdmin.save();
      } else {
      }
    } else {
      // Créer le compte admin
      const hashedPassword = await bcrypt.hash('Admin2025!', 10);

      const admin = await Company.create({
        nom: 'TalentProof Admin',
        email: 'info@princeaman.dev',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isConfirmed: true,
        nombreEmployes: '1-10',
      });

    }

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

createAdminUser();
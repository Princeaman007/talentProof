import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Company from './models/Company.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Company.findOne({ email: 'info@princeaman.dev' });

    if (existingAdmin) {
      console.log('⚠️  Un compte avec cet email existe déjà');
      
      // Mettre à jour en admin si ce n'est pas le cas
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.isActive = true;
        existingAdmin.isConfirmed = true;
        await existingAdmin.save();
        console.log('✅ Compte existant mis à jour en admin');
      } else {
        console.log('✅ Le compte admin existe déjà');
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

      console.log('✅ Compte admin créé avec succès');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Mot de passe: Admin2025!');
      console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createAdminUser();
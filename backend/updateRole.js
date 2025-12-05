import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './models/Company.js';

dotenv.config();

const updateAdminRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

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
    } else {
    }

    // Vérifier
    const admin = await Company.findOne({ email: 'info@princeaman.dev' });
      email: admin.email,
      nom: admin.nom,
      role: admin.role,
      isActive: admin.isActive,
    });

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

updateAdminRole();
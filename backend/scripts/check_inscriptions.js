import mongoose from 'mongoose';
import TalentDay from '../models/Talentday.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkInscriptions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const talentDays = await TalentDay.find({}).lean();
    
    
    let totalInscriptions = 0;
    talentDays.forEach((td, index) => {
      const nbInscriptions = td.inscriptions?.length || 0;
      totalInscriptions += nbInscriptions;
      
      if (nbInscriptions > 0) {
        
        td.inscriptions.forEach((ins, i) => {
        });
      }
    });
    
    
    await mongoose.disconnect();
  } catch (error) {
    process.exit(1);
  }
}

checkInscriptions();

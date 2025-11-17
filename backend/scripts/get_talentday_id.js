import mongoose from 'mongoose';
import TalentDay from '../models/Talentday.js';
import dotenv from 'dotenv';

dotenv.config();

async function getTalentDayId() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const talentDays = await TalentDay.find({});
    
    console.log('Total TalentDays:', talentDays.length);
    talentDays.forEach((td, idx) => {
      console.log(`\n${idx + 1}. ${td.titre} (ID: ${td._id})`);
      console.log(`   Inscriptions: ${td.inscriptions?.length || 0}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

getTalentDayId();

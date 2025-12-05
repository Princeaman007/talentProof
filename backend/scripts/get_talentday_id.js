import mongoose from 'mongoose';
import TalentDay from '../models/Talentday.js';
import dotenv from 'dotenv';

dotenv.config();

async function getTalentDayId() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const talentDays = await TalentDay.find({});
    
    talentDays.forEach((td, idx) => {
    });
    
    await mongoose.disconnect();
  } catch (error) {
    process.exit(1);
  }
}

getTalentDayId();

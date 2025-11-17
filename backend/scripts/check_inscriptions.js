import mongoose from 'mongoose';
import TalentDay from '../models/Talentday.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkInscriptions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');
    
    const talentDays = await TalentDay.find({}).lean();
    
    console.log(`📊 Total TalentDays dans la DB: ${talentDays.length}\n`);
    
    let totalInscriptions = 0;
    talentDays.forEach((td, index) => {
      const nbInscriptions = td.inscriptions?.length || 0;
      totalInscriptions += nbInscriptions;
      
      if (nbInscriptions > 0) {
        console.log(`\n📅 TalentDay #${index + 1}: ${td.titre}`);
        console.log(`   👥 Inscriptions: ${nbInscriptions}`);
        console.log(`   📍 Places disponibles: ${td.placesDisponibles}`);
        console.log(`   🎯 Places restantes: ${td.placesRestantes}`);
        
        td.inscriptions.forEach((ins, i) => {
          console.log(`      ${i + 1}. ${ins.nom} (${ins.email}) - ${ins.statut}`);
        });
      }
    });
    
    console.log(`\n\n✅ Total inscriptions dans la DB: ${totalInscriptions}`);
    
    await mongoose.disconnect();
    console.log('\n✅ Déconnecté de MongoDB');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkInscriptions();

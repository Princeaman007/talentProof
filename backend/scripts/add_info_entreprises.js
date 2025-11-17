import mongoose from 'mongoose';
import Talentday from '../models/Talentday.js';

const addInfoEntreprises = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/talentproof');
    console.log('✅ Connecté à MongoDB');

    // Trouver le TalentDay "Test Dev"
    const talentDay = await Talentday.findOne({ titre: /Test Dev/i });
    
    if (!talentDay) {
      console.log('❌ TalentDay "Test Dev" non trouvé');
      process.exit(1);
    }

    console.log('📝 TalentDay trouvé:', talentDay.titre);

    // Ajouter les informations entreprises
    talentDay.infoEntreprises = {
      titre: 'Pourquoi participer en tant qu\'entreprise ?',
      description: 'Participez à notre TalentDay et rencontrez les meilleurs développeurs web et freelances. Une occasion unique de recruter des talents qualifiés et de présenter votre entreprise.',
      avantages: [
        'Accès direct à des développeurs qualifiés',
        'Sessions de speed-recruiting organisées',
        'Stand de présentation de votre entreprise',
        'Networking avec d\'autres entreprises tech',
        'Visibilité auprès de la communauté tech'
      ],
      profils: [
        'Développeur Full-Stack React/Node.js',
        'Développeur Frontend (React, Vue.js)',
        'Développeur Backend (Node.js, Python)',
        'Développeur Mobile (React Native, Flutter)',
        'DevOps Engineer'
      ],
      formats: [
        {
          nom: 'Speed-recruiting',
          description: 'Entretiens courts de 15 minutes avec plusieurs candidats',
          duree: '15 min par candidat'
        },
        {
          nom: 'Présentation entreprise',
          description: 'Présentez votre entreprise et vos opportunités',
          duree: '20 min'
        },
        {
          nom: 'Networking',
          description: 'Session informelle d\'échange avec les talents',
          duree: '1h'
        }
      ],
      tarif: 'Gratuit',
      placesEntreprises: 10,
      contact: {
        nom: 'Sophie Martin',
        email: 'entreprises@talentproof.com',
        telephone: '+32 2 123 4567'
      }
    };

    await talentDay.save();
    console.log('✅ Informations entreprises ajoutées avec succès !');
    console.log('\n📋 Détails:');
    console.log('- Titre:', talentDay.infoEntreprises.titre);
    console.log('- Avantages:', talentDay.infoEntreprises.avantages.length);
    console.log('- Profils:', talentDay.infoEntreprises.profils.length);
    console.log('- Formats:', talentDay.infoEntreprises.formats.length);
    console.log('- Tarif:', talentDay.infoEntreprises.tarif);
    console.log('- Places:', talentDay.infoEntreprises.placesEntreprises);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

addInfoEntreprises();

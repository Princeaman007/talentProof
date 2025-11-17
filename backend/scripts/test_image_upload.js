import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'http://localhost:5000/api';

// Fonction pour se connecter en tant qu'admin
async function loginAsAdmin() {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        email: 'admin@talentproof.com',
        password: 'admin123'
      },
      {
        withCredentials: true
      }
    );
    
    console.log('✅ Connexion admin réussie');
    return response.headers['set-cookie'];
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    throw error;
  }
}

// Fonction pour créer un TalentDay avec image
async function createTalentDayWithImage(cookies) {
  try {
    const form = new FormData();
    
    // Ajouter les champs texte
    form.append('titre', 'Test TalentDay avec Image');
    form.append('description', 'Ceci est un test d\'upload d\'image');
    form.append('date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()); // Dans 7 jours
    form.append('heure', '14:00');
    form.append('duree', '3');
    form.append('lieu', JSON.stringify({ adresse: 'Paris', ville: 'Paris', codePostal: '75001' }));
    form.append('technologies', JSON.stringify(['JavaScript', 'React']));
    form.append('niveau', 'Intermédiaire');
    form.append('programme', 'Introduction\nPratique\nConclusion');
    form.append('prerequis', 'Connaissance de base en JS');
    form.append('typeFormation', 'Présentiel');
    form.append('placesDisponibles', '15');
    form.append('statut', 'ouvert');
    
    // Créer une image de test simple (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const testImagePath = path.join(__dirname, 'test-image.png');
    fs.writeFileSync(testImagePath, testImageBuffer);
    
    // Ajouter l'image au formulaire
    form.append('image', fs.createReadStream(testImagePath));
    
    const response = await axios.post(
      `${API_BASE_URL}/talent-days`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Cookie: cookies
        },
        withCredentials: true
      }
    );
    
    console.log('✅ TalentDay créé avec succès!');
    console.log('📍 Image URL:', response.data.talentDay.image);
    console.log('📋 Détails:', {
      id: response.data.talentDay._id,
      titre: response.data.talentDay.titre,
      image: response.data.talentDay.image
    });
    
    // Nettoyer l'image de test
    fs.unlinkSync(testImagePath);
    
    return response.data.talentDay;
  } catch (error) {
    console.error('❌ Erreur de création:', error.response?.data || error.message);
    throw error;
  }
}

// Fonction pour vérifier que l'image est accessible
async function verifyImageAccess(imageUrl) {
  try {
    const fullUrl = `http://localhost:5000${imageUrl}`;
    const response = await axios.get(fullUrl, { responseType: 'arraybuffer' });
    
    console.log('✅ Image accessible!');
    console.log('📊 Taille:', response.data.length, 'bytes');
    console.log('🎨 Content-Type:', response.headers['content-type']);
  } catch (error) {
    console.error('❌ Image non accessible:', error.message);
    throw error;
  }
}

// Exécution du test
async function runTest() {
  console.log('🚀 Début du test d\'upload d\'image TalentDay\n');
  
  try {
    // 1. Connexion
    const cookies = await loginAsAdmin();
    
    // 2. Création avec image
    const talentDay = await createTalentDayWithImage(cookies);
    
    // 3. Vérification de l'accès à l'image
    await verifyImageAccess(talentDay.image);
    
    console.log('\n✅ Test terminé avec succès!');
  } catch (error) {
    console.error('\n❌ Test échoué:', error.message);
    process.exit(1);
  }
}

runTest();

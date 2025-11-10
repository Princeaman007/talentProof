import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import talentRoutes from './routes/talentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import teamRoutes from './routes/teamRoutes.js';

dotenv.config();

// Configuration __dirname pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur MongoDB:', err));

// Routes de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API TalentProof',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      talents: '/api/talents',
      admin: '/api/admin',
      team: '/api/team',
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);

// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route non trouvée' 
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Une erreur est survenue!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📚 API Documentation disponible sur http://localhost:${PORT}`);
});
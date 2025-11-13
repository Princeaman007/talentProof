import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import talentRoutes from './routes/talentRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js'; 
import devisRoutes from './routes/devisRoutes.js';

// ✅ Routes admin fusionnées (Phase 1-4)
import adminRoutes from './routes/adminRoutes.js';

// ✅ Routes entreprise (Phase 4)
import entrepriseRoutes from './routes/entreprise.js';

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
    version: '2.0.0 - Phase 4',
    endpoints: {
      auth: '/api/auth',
      talents: '/api/talents',
      team: '/api/team',
      portfolio: '/api/portfolio',
      devis: '/api/devis',
      admin: '/api/admin',           // ✅ Dashboard admin (stats, entreprises, CRUD)
      entreprise: '/api/entreprise', // ✅ Dashboard entreprise (favoris, notifications)
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// ========================================
// ROUTES API
// ========================================

// Routes publiques et authentification
app.use('/api/auth', authRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/devis', devisRoutes);

// ✅ Routes admin (fusionnées Phase 1-4)
app.use('/api/admin', adminRoutes);

// ✅ Routes entreprise dashboard (Phase 4)
app.use('/api/entreprise', entrepriseRoutes);

// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route non trouvée',
    requestedUrl: req.originalUrl,
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Une erreur est survenue!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur TalentProof démarré`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Phase 4 - Dashboard Admin & Entreprise activé`);
});

export default app;
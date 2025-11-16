import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import talentRoutes from './routes/talentRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js'; 
import devisRoutes from './routes/devisRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

// ✅ Routes admin fusionnées (Phase 1-4)
import adminRoutes from './routes/adminRoutes.js';

// ✅ Routes entreprise (Phase 4)
import entrepriseRoutes from './routes/entreprise.js';

// ✅ Documentation Swagger
import { swaggerSpec } from './utils/swagger.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './utils/errorHandler.js';

dotenv.config();

// ✅ SÉCURITÉ: Valider les variables d'environnement critiques au démarrage
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);
if (missingEnvVars.length > 0) {
  console.error('❌ ERREUR: Variables d\'environnement manquantes:', missingEnvVars.join(', '));
  process.exit(1);
}

// Configuration __dirname pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ SÉCURITÉ: Headers de sécurité (helmet)
app.use(helmet());

// ✅ SÉCURITÉ: CORS restrictif (au lieu de cors() ouvert)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 heures
}));

// ✅ SÉCURITÉ: Rate limiting global (moins strict)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par 15 min
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ✅ SÉCURITÉ: Rate limiting strict pour authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  skipSuccessfulRequests: true, // Ne pas compter les requêtes réussies
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SÉCURITÉ: Parser les cookies
app.use(cookieParser());

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ DOCUMENTATION: Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, { customCss: '.swagger-ui { max-width: 1200px; }' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('MongoDB connecté'))
  .catch((err) => logger.error('MongoDB connection error', { error: err.message }));

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

// Routes publiques et authentification (avec rate-limiting strict)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/public', publicRoutes);

// ✅ Routes admin (fusionnées Phase 1-4)
app.use('/api/admin', adminRoutes);

// ✅ Routes entreprise dashboard (Phase 4)
app.use('/api/entreprise', entrepriseRoutes);

// Route 404
app.use((req, res) => {
  logger.warn('Route not found', { method: req.method, path: req.path });
  res.status(404).json({ 
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route non trouvée',
    },
    path: req.originalUrl,
  });
});

// ✅ Gestion d'erreurs centralisée
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info('TalentProof Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    mongoConnection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
  console.log(`🚀 Serveur TalentProof démarré`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📚 Documentation API: http://localhost:${PORT}/api-docs`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Sécurité: Helmet activé, CORS restrictif, Rate-limiting actif`);
});

export default app;
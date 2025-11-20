import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import Redis from 'ioredis';
import RedisStorePkg from 'rate-limit-redis';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import swaggerUi from 'swagger-ui-express';
// Start background workers (worker will decide whether to run based on REDIS_URL)
import './queues/worker.js';
// Import des routes
import authRoutes from './routes/authRoutes.js';
import talentRoutes from './routes/talentRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js'; 
import devisRoutes from './routes/devisRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import talentDayRoutes from './routes/talentDayRoutes.js';
import companyRoutes from './routes/companyRoutes.js';


//  Routes admin fusionnées (Phase 1-4)
import adminRoutes from './routes/adminRoutes.js';

//  Routes entreprise (Phase 4)
import entrepriseRoutes from './routes/entreprise.js';

//  Documentation Swagger
import { swaggerSpec } from './utils/swagger.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './utils/errorHandler.js';

dotenv.config();

//  SÉCURITÉ: Valider les variables d'environnement critiques au démarrage
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);
if (missingEnvVars.length > 0) {
  console.error(' ERREUR: Variables d\'environnement manquantes:', missingEnvVars.join(', '));
  process.exit(1);
}

// Configuration __dirname pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy when running behind a load balancer / reverse proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Response compression
app.use(compression());

//  SÉCURITÉ: Headers de sécurité (helmet)
app.use(helmet());

// Content Security Policy and HSTS
// - In production we apply a strict CSP and enable HSTS (preloadable)
// - In development we allow localhost dev servers and relax eval/inline for Vite HMR
const isProd = process.env.NODE_ENV === 'production';
const devHosts = ['http://localhost:5173', 'http://localhost:3000'];

// Add commonly used external resources (Google Fonts)
const externalFontHosts = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

const scriptSrc = ["'self'"];
const styleSrc = ["'self'"];
const connectSrc = ["'self'"];
const fontSrc = ["'self'", 'data:', 'https:'];

if (!isProd) {
  // Vite dev server and local frontend
  scriptSrc.push("'unsafe-eval'", "'unsafe-inline'", ...devHosts);
  styleSrc.push("'unsafe-inline'", ...devHosts, ...externalFontHosts);
  connectSrc.push(...devHosts);
} else {
  // In production, explicitly allow Google Fonts domains for fonts/styles
  styleSrc.push(...externalFontHosts);
  fontSrc.push(...externalFontHosts);
}

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc,
      styleSrc,
      imgSrc: ["'self'", 'data:', 'blob:', 'http://localhost:5000', 'http://localhost:5174'],
      connectSrc,
      fontSrc,
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  })
);

// Configuration spéciale de Cross-Origin pour les fichiers statiques
app.use(
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" })
);

if (isProd) {
  // Enforce HSTS in production
  app.use(
    helmet.hsts({
      maxAge: 63072000, // 2 years in seconds
      includeSubDomains: true,
      preload: true,
    })
  );
}

//  SÉCURITÉ: CORS restrictif (au lieu de cors() ouvert)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:3000').split(',');
console.log(' CORS allowedOrigins:', allowedOrigins);

// CORS configuration with dynamic origin validation
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In production, also allow *.onrender.com domains
    if (process.env.NODE_ENV === 'production' && origin.endsWith('.onrender.com')) {
      console.log(' Allowing Render domain:', origin);
      return callback(null, true);
    }
    
    console.warn(' CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization' , 'X-CSRF-Token'],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 heures
}));

//  SÉCURITÉ: Rate limiting global (moins strict)
// Configure rate limiter store: prefer Redis when REDIS_URL is set (cluster-ready)
let globalLimiter;
try {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const redisClient = new Redis(redisUrl);
    const RedisStore = RedisStorePkg.default || RedisStorePkg;
    const store = new RedisStore({ client: redisClient, prefix: 'rl:' });
    globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.NODE_ENV === 'production' ? 100 : 500, // 500 en dev, 100 en prod
      message: 'Trop de requêtes, veuillez réessayer plus tard.',
      standardHeaders: true,
      legacyHeaders: false,
      store,
    });
    logger.info('Rate limiter using Redis store', { redis: redisUrl });
  } else {
    globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.NODE_ENV === 'production' ? 100 : 500, // 500 en dev, 100 en prod
      message: 'Trop de requêtes, veuillez réessayer plus tard.',
      standardHeaders: true,
      legacyHeaders: false,
    });
  }
} catch (e) {
  logger.error('Unable to setup Redis-backed rate limiter, falling back to memory store', { error: e.message });
  globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 100 : 500, // 500 en dev, 100 en prod
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
  });
}
app.use(globalLimiter);

//  SÉCURITÉ: Rate limiting strict pour authentification
let authLimiter;
try {
  // Try to reuse same Redis store if available
  const redisUrl = process.env.REDIS_URL;
  const isDev = process.env.NODE_ENV !== 'production';
  
  //  TEMPORAIRE: Limite plus élevée en production pour les tests
  const maxAttempts = isDev ? 100 : 50; // 100 en dev, 50 en production (au lieu de 5)
  
  if (redisUrl) {
    const redisClient2 = new Redis(redisUrl);
    const RedisStore = RedisStorePkg.default || RedisStorePkg;
    const store2 = new RedisStore({ client: redisClient2, prefix: 'rl_auth:' });
    authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: maxAttempts,
      message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
      skipSuccessfulRequests: true,
      standardHeaders: true,
      legacyHeaders: false,
      store: store2,
    });
  } else {
    authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: maxAttempts,
      message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
      skipSuccessfulRequests: true, // Ne pas compter les requêtes réussies
      standardHeaders: true,
      legacyHeaders: false,
    });
  }
} catch (e) {
  logger.error('Unable to setup Redis-backed auth rate limiter, falling back to memory store', { error: e.message });
  const isDev = process.env.NODE_ENV !== 'production';
  const maxAttempts = isDev ? 100 : 50;
  authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: maxAttempts,
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
  });
}

// Limiter la taille des payloads pour éviter certains DOS
app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.REQUEST_BODY_LIMIT || '10mb' }));

//  SÉCURITÉ: Parser les cookies
app.use(cookieParser());

// 🔍 DEBUG: Log ALL incoming requests
app.use((req, res, next) => {
  console.log(`🌐 [${req.method}] ${req.path} - Origin: ${req.get('origin') || 'none'}`);
  next();
});

//  CSRF protection - double-submit cookie pattern
// Configure cookie options (secure in production). We run csurf middleware for
// `/api` routes but skip it for health/docs/static endpoints.
const csrfProtection = csurf({
  cookie: {
    httpOnly: false, // frontend needs to read the token
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // 'None' for cross-origin in production
    secure: process.env.NODE_ENV === 'production', // Must be true when sameSite='None'
  },
});

// Apply CSRF middleware for API routes while skipping non-API or safe public routes
app.use((req, res, next) => {
  // Skip docs, health checks, static uploads, public forms (contact, company registration)
  if (
    req.path.startsWith('/api-docs') || 
    req.path === '/api/health' || 
    req.path === '/api/csrf-token' || // Allow CSRF token fetch without token
    req.path.startsWith('/uploads') ||
    req.path === '/api/contact' ||
    req.path.startsWith('/api/talent-days') ||
    req.path === '/api/auth/forgot-password' || // ✅ Allow forgot password without CSRF
    req.path.startsWith('/api/auth/reset-password') || // ✅ Allow reset password without CSRF
    (req.path === '/api/companies' && req.method === 'POST') // Public company registration
    
  ) {
    return next();
  }

  // Only initialize CSRF for API routes (this will attach req.csrfToken())
  if (req.path.startsWith('/api')) {
    return csrfProtection(req, res, next);
  }

  return next();
});

// Expose an endpoint for the frontend to fetch the CSRF token (GET is safe)
// IMPORTANT: Must be placed AFTER cookieParser but will skip CSRF validation above
app.get('/api/csrf-token', (req, res) => {
  try {
    // Generate a new CSRF token without requiring an existing one
    const token = req.csrfToken ? req.csrfToken() : null;
    if (!token) {
      // If csrfToken method not available, manually trigger csurf middleware
      return csrfProtection(req, res, (err) => {
        if (err) {
          logger.error('CSRF middleware error', { error: err.message });
          return res.status(500).json({ success: false, message: 'CSRF error' });
        }
        return res.status(200).json({ csrfToken: req.csrfToken() });
      });
    }
    return res.status(200).json({ csrfToken: token });
  } catch (err) {
    logger.error('CSRF token generation failed', { error: err && err.message });
    return res.status(500).json({ success: false, message: 'Impossible de générer CSRF token' });
  }
});

// Servir les fichiers statiques (uploads) avec CORS
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

//  DOCUMENTATION: Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, { customCss: '.swagger-ui { max-width: 1200px; }' }));

// MongoDB Connection with detailed logging and error handling
console.log('[MONGODB] Attempting to connect...');
console.log('[MONGODB] URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'NOT SET');
console.log('[MONGODB] Connection timeout:', process.env.MONGO_TIMEOUT || '30000ms (default)');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: parseInt(process.env.MONGO_TIMEOUT) || 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
})
  .then(() => {
    console.log('[MONGODB] Connected successfully');
    logger.info('MongoDB connecté', {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    });
  })
  .catch((err) => {
    console.error('[MONGODB] Connection FAILED:', {
      message: err.message,
      code: err.code,
      name: err.name
    });
    logger.error('MongoDB connection error', { 
      error: err.message,
      code: err.code,
      stack: err.stack
    });
    
    // Exit process if MongoDB connection fails in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[MONGODB] CRITICAL: Cannot start server without database connection');
      process.exit(1);
    }
  });

// Monitor MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[MONGODB] Disconnected from database');
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MONGODB] Reconnected to database');
  logger.info('MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('[MONGODB] Connection error:', err.message);
  logger.error('MongoDB error', { error: err.message });
});

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
      admin: '/api/admin',           //  Dashboard admin (stats, entreprises, CRUD)
      entreprise: '/api/entreprise', //  Dashboard entreprise (favoris, notifications)
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
app.use('/api/contact', contactRoutes);
app.use('/api/talent-days', talentDayRoutes);
app.use('/api/companies', companyRoutes);

//  Routes admin (fusionnées Phase 1-4)
app.use('/api/admin', adminRoutes);

//  Routes entreprise dashboard (Phase 4)
app.use('/api/entreprise', entrepriseRoutes);

// Routes non trouvées (404)
app.use(notFoundHandler);

// Gestion d'erreurs centralisée (doit être en dernier)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start listening only when not in test mode. This allows tests to import
// the `app` without starting the HTTP server (useful for supertest + memory DB).
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info('TalentProof Server started', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      mongoConnection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    });
    console.log(` Serveur TalentProof démarré`);
    console.log(` http://localhost:${PORT}`);
    console.log(` Documentation API: http://localhost:${PORT}/api-docs`);
    console.log(` Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Sécurité: Helmet activé, CORS restrictif, Rate-limiting actif`);
  });
}

export default app;
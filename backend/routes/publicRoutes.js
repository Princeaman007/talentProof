// routes/public.routes.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import Entreprise from '../models/Company.js';
import Talent from '../models/Talent.js';

const router = express.Router();

// Limiter les appels aux stats publiques (éviter le spam)
const publicStatsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Max 30 requêtes par minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, veuillez réessayer plus tard' },
});

router.get('/entreprises/count', publicStatsLimiter, async (req, res) => {
  try {
    const count = await Entreprise.countDocuments({
      isActive: true,
      suspendedAt: null,
    });
    res.json({ count, message: "Nombre d'entreprises partenaires" });
  } catch (error) {
    console.error('Erreur comptage entreprises:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du nombre d'entreprises" });
  }
});

router.get('/talents/count', publicStatsLimiter, async (req, res) => {
  try {
    const count = await Talent.countDocuments({ isValidated: true });
    res.json({ count, message: 'Nombre de talents validés' });
  } catch (error) {
    console.error('Erreur comptage talents:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du nombre de talents" });
  }
});

router.get('/stats', publicStatsLimiter, async (req, res) => {
  try {
    const [entreprisesCount, talentsCount] = await Promise.all([
      Entreprise.countDocuments({ isActive: true, suspendedAt: null }),
      Talent.countDocuments({ isValidated: true }),
    ]);
    res.json({
      stats: { entreprisesCount, talentsCount },
      message: 'Statistiques publiques de TalentProof'
    });
  } catch (error) {
    console.error('Erreur récupération stats publiques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

export default router;

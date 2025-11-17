import express from 'express';
import rateLimit from 'express-rate-limit';
import Entreprise from '../models/Company.js';
import Talent from '../models/Talent.js';
import ContactRequest from '../models/Contactrequest.js'; // ← Ajoute cet import

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
    const count = await Talent.countDocuments({ statut: 'actif' });
    res.json({ count, message: 'Nombre de talents validés' });
  } catch (error) {
    console.error('Erreur comptage talents:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du nombre de talents" });
  }
});

// ✅ NOUVELLE ROUTE : Statistiques complètes avec taux de succès
router.get('/stats', publicStatsLimiter, async (req, res) => {
  try {
    const [entreprisesCount, talentsCount, totalDemandes, demandesTraitees] = await Promise.all([
      Entreprise.countDocuments({ isActive: true, suspendedAt: null }),
      Talent.countDocuments({ statut: 'actif' }),
      ContactRequest.countDocuments(),
      ContactRequest.countDocuments({ statut: 'traité' }),
    ]);

    // Calcul du taux de succès
    const tauxSucces = totalDemandes > 0 
      ? Math.round((demandesTraitees / totalDemandes) * 100) 
      : 0;

    res.json({
      stats: {
        talentsValides: talentsCount,
        entreprisesPartenaires: entreprisesCount,
        tauxSucces: tauxSucces,
        totalDemandes: totalDemandes,
        demandesTraitees: demandesTraitees,
      },
      message: 'Statistiques publiques de TalentProof'
    });
  } catch (error) {
    console.error('Erreur récupération stats publiques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

export default router;
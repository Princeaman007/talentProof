import Company from '../models/Company.js';
import Talent from '../models/Talent.js';
import ContactRequest from '../models/ContactRequest.js';
import Devis from '../models/Devis.js';

// @desc    Obtenir statistiques globales avancées
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    // Compter les entités
    const [
      entreprisesCount,
      talentsCount,
      contactRequestsCount,
      devisCount,
      entreprisesActives,
      talentsActifs,
      contactRequestsTraitees,
    ] = await Promise.all([
      Company.countDocuments({ role: 'entreprise' }),
      Talent.countDocuments(),
      ContactRequest.countDocuments(),
      Devis.countDocuments(),
      Company.countDocuments({ role: 'entreprise', isActive: true }),
      Talent.countDocuments({ statut: 'actif' }),
      ContactRequest.countDocuments({ statut: 'traité' }),
    ]);

    // Calculer le taux de succès (demandes traitées / total)
    const tauxSucces = contactRequestsCount > 0 
      ? Math.round((contactRequestsTraitees / contactRequestsCount) * 100)
      : 0;

    // Statistiques récentes (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      newEntreprisesMonth,
      newTalentsMonth,
      newContactRequestsMonth,
      newDevisMonth,
    ] = await Promise.all([
      Company.countDocuments({ 
        role: 'entreprise', 
        createdAt: { $gte: thirtyDaysAgo } 
      }),
      Talent.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo } 
      }),
      ContactRequest.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo } 
      }),
      Devis.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo } 
      }),
    ]);

    // Talents les plus demandés (top 5)
    const topTalents = await ContactRequest.aggregate([
      {
        $group: {
          _id: '$talent',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'talents',
          localField: '_id',
          foreignField: '_id',
          as: 'talentInfo',
        },
      },
      { $unwind: '$talentInfo' },
      {
        $project: {
          _id: 1,
          count: 1,
          prenom: '$talentInfo.prenom',
          technologies: '$talentInfo.technologies',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        // Totaux
        entreprisesCount,
        talentsCount,
        contactRequestsCount,
        devisCount,
        
        // Stats d'activité
        entreprisesActives,
        talentsActifs,
        tauxSucces,
        
        // Nouveautés (30 jours)
        recentStats: {
          newEntreprises: newEntreprisesMonth,
          newTalents: newTalentsMonth,
          newContactRequests: newContactRequestsMonth,
          newDevis: newDevisMonth,
        },
        
        // Top talents
        topTalents,
      },
    });
  } catch (error) {
    console.error('Erreur getAdminStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    });
  }
};

// @desc    Obtenir évolution temporelle pour graphiques
// @route   GET /api/admin/stats/timeline
// @access  Private/Admin
export const getStatsTimeline = async (req, res) => {
  try {
    const { period = '6m' } = req.query; // 6m, 1y, all

    let startDate;
    const now = new Date();

    switch (period) {
      case '1m':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6m':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0); // Depuis le début
    }

    // Évolution des entreprises inscrites par mois
    const entreprisesTimeline = await Company.aggregate([
      {
        $match: {
          role: 'entreprise',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Évolution des talents ajoutés par mois
    const talentsTimeline = await Talent.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Évolution des demandes de contact par mois
    const contactRequestsTimeline = await ContactRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      timeline: {
        entreprises: entreprisesTimeline,
        talents: talentsTimeline,
        contactRequests: contactRequestsTimeline,
      },
    });
  } catch (error) {
    console.error('Erreur getStatsTimeline:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'évolution temporelle',
      error: error.message,
    });
  }
};
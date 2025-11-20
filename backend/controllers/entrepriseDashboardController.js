import ContactRequest from '../models/ContactRequest.js';
import Devis from '../models/Devis.js';
import Favoris from '../models/Favoris.js';
import Company from '../models/Company.js';
import AppError, { 
  validationError, 
  emailAlreadyExists,
  notFound,
  internalError,
  unauthorized,
  forbidden
} from '../utils/AppError.js';
import { asyncHandler } from '../utils/errorHandler.js';

// @desc    Obtenir statistiques personnelles entreprise
// @route   GET /api/entreprise/dashboard/stats
// @access  Private/Entreprise
export const getEntrepriseDashboardStats = asyncHandler(async (req, res) => {
  const entrepriseEmail = req.user.email;

  // Compter les demandes de contact envoyées
  const contactRequestsCount = await ContactRequest.countDocuments({
    recruteurEmail: entrepriseEmail,
  });

  // Compter les devis demandés
  const devisCount = await Devis.countDocuments({
    email: entrepriseEmail,
  });

  // Compter les favoris
  const favorisCount = await Favoris.countDocuments({
    entreprise: req.user._id,
  });

  // Dernières demandes de contact (5 dernières)
  const recentContactRequests = await ContactRequest.find({
    recruteurEmail: entrepriseEmail,
  })
    .populate('talent', 'prenom photo technologies disponibilite')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    stats: {
      contactRequestsCount,
      devisCount,
      favorisCount,
      recentContactRequests,
    },
  });
});

// @desc    Obtenir toutes mes demandes de contact
// @route   GET /api/entreprise/contact-requests
// @access  Private/Entreprise
export const getMyContactRequests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, statut = 'all' } = req.query;
  const skip = (page - 1) * limit;

  const filter = { recruteurEmail: req.user.email };

  if (statut !== 'all') {
    filter.statut = statut;
  }

  const contactRequests = await ContactRequest.find(filter)
    .populate('talent', 'prenom photo technologies scoreTest disponibilite typeProfil')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ContactRequest.countDocuments(filter);

  res.status(200).json({
    success: true,
    contactRequests,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    },
  });
});
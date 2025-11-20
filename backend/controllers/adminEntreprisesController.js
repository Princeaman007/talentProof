import Company from '../models/Company.js';
import ContactRequest from '../models/ContactRequest.js';
import Devis from '../models/Devis.js';
import AppError, { 
  validationError, 
  notFound,
  forbidden
} from '../utils/AppError.js';
import { asyncHandler } from '../utils/errorHandler.js';

// @desc    Obtenir toutes les entreprises
// @route   GET /api/admin/entreprises
// @access  Private/Admin
export const getAllEntreprises = asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = 'all' // all, active, inactive, suspended
    } = req.query;

    const skip = (page - 1) * limit;

    // Construire le filtre
    const filter = { role: 'entreprise' };

    // Filtre de recherche
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filtre de statut
    if (status === 'active') {
      filter.isActive = true;
      filter.suspendedAt = null;
    } else if (status === 'inactive') {
      filter.isActive = false;
    } else if (status === 'suspended') {
      filter.suspendedAt = { $ne: null };
    }

    // Récupérer les entreprises
    const entreprises = await Company.find(filter)
      .select('-password -confirmationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Company.countDocuments(filter);

    // Enrichir avec statistiques pour chaque entreprise
    const entreprisesWithStats = await Promise.all(
      entreprises.map(async (entreprise) => {
        const [contactRequestsCount, devisCount] = await Promise.all([
          ContactRequest.countDocuments({ 
            recruteurEmail: entreprise.email 
          }),
          Devis.countDocuments({ 
            email: entreprise.email 
          }),
        ]);

        return {
          ...entreprise.toObject(),
          stats: {
            contactRequests: contactRequestsCount,
            devis: devisCount,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      entreprises: entreprisesWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
});

// @desc    Suspendre une entreprise
// @route   PUT /api/admin/entreprises/:id/suspend
// @access  Private/Admin
export const suspendEntreprise = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      throw validationError('La raison de suspension est requise');
    }

    const entreprise = await Company.findById(id);

    if (!entreprise) {
      throw notFound('Entreprise');
    }

    if (entreprise.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Impossible de suspendre un compte admin',
      });
    }

    entreprise.isActive = false;
    entreprise.suspendedAt = new Date();
    entreprise.suspensionReason = reason;

    await entreprise.save();

    res.status(200).json({
      success: true,
      message: 'Entreprise suspendue avec succès',
      entreprise: {
        _id: entreprise._id,
        nom: entreprise.nom,
        email: entreprise.email,
        isActive: entreprise.isActive,
        suspendedAt: entreprise.suspendedAt,
        suspensionReason: entreprise.suspensionReason,
      },
    });
});

// @desc    Réactiver une entreprise
// @route   PUT /api/admin/entreprises/:id/activate
// @access  Private/Admin
export const activateEntreprise = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const entreprise = await Company.findById(id);

    if (!entreprise) {
      throw notFound('Entreprise');
    }

    entreprise.isActive = true;
    entreprise.suspendedAt = null;
    entreprise.suspensionReason = null;

    await entreprise.save();

    res.status(200).json({
      success: true,
      message: 'Entreprise réactivée avec succès',
      entreprise: {
        _id: entreprise._id,
        nom: entreprise.nom,
        email: entreprise.email,
        isActive: entreprise.isActive,
      },
    });
});

// @desc    Obtenir l'activité d'une entreprise
// @route   GET /api/admin/entreprises/:id/activity
// @access  Private/Admin
export const getEntrepriseActivity = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const entreprise = await Company.findById(id).select('-password');

    if (!entreprise) {
      throw notFound('Entreprise');
    }

    // Récupérer l'activité récente
    const [contactRequests, devis] = await Promise.all([
      ContactRequest.find({ recruteurEmail: entreprise.email })
        .populate('talent', 'prenom technologies')
        .sort({ createdAt: -1 })
        .limit(10),
      Devis.find({ email: entreprise.email })
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.status(200).json({
      success: true,
      entreprise: {
        ...entreprise.toObject(),
        activity: {
          contactRequests,
          devis,
        },
      },
    });
});
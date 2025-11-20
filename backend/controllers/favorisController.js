import Favoris from '../models/Favoris.js';
import Talent from '../models/Talent.js';
import AppError, { 
  validationError, 
  notFound,
  forbidden
} from '../utils/AppError.js';
import { asyncHandler } from '../utils/errorHandler.js';

// @desc    Ajouter un talent aux favoris
// @route   POST /api/entreprise/favoris
// @access  Private/Entreprise
export const addFavori = asyncHandler(async (req, res) => {
  const { talentId, note } = req.body;

  if (!talentId) {
    throw validationError('L\'ID du talent est requis');
  }

  // Vérifier que le talent existe
  const talent = await Talent.findById(talentId);
  if (!talent) {
    throw notFound('Talent');
  }

  // Vérifier si déjà en favoris
  const existingFavori = await Favoris.findOne({
    entreprise: req.user._id,
    talent: talentId,
  });

  if (existingFavori) {
    throw new AppError('Ce talent est déjà dans vos favoris', 'DUPLICATE_FAVORI', 400);
  }

  // Créer le favori
  const favori = await Favoris.create({
    entreprise: req.user._id,
    talent: talentId,
    note: note || null,
  });

  const populatedFavori = await Favoris.findById(favori._id)
    .populate('talent', 'prenom photo technologies scoreTest disponibilite typeProfil');

  res.status(201).json({
    success: true,
    message: 'Talent ajouté aux favoris',
    favori: populatedFavori,
  });
});

// @desc    Retirer un talent des favoris
// @route   DELETE /api/entreprise/favoris/:talentId
// @access  Private/Entreprise
export const removeFavori = asyncHandler(async (req, res) => {
  const { talentId } = req.params;

  const favori = await Favoris.findOneAndDelete({
    entreprise: req.user._id,
    talent: talentId,
  });

  if (!favori) {
    throw notFound('Favori');
  }

  res.status(200).json({
    success: true,
    message: 'Talent retiré des favoris',
  });
});

// @desc    Obtenir tous mes favoris
// @route   GET /api/entreprise/favoris
// @access  Private/Entreprise
export const getFavoris = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const favoris = await Favoris.find({ entreprise: req.user._id })
    .populate('talent')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Favoris.countDocuments({ entreprise: req.user._id });

  res.status(200).json({
    success: true,
    favoris,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    },
  });
});

// @desc    Modifier la note d'un favori
// @route   PUT /api/entreprise/favoris/:talentId/note
// @access  Private/Entreprise
export const updateFavoriNote = asyncHandler(async (req, res) => {
  const { talentId } = req.params;
  const { note } = req.body;

  const favori = await Favoris.findOneAndUpdate(
    {
      entreprise: req.user._id,
      talent: talentId,
    },
    { note },
    { new: true }
  ).populate('talent');

  if (!favori) {
    throw notFound('Favori');
  }

  res.status(200).json({
    success: true,
    message: 'Note mise à jour',
    favori,
  });
});

// @desc    Vérifier si un talent est en favoris
// @route   GET /api/entreprise/favoris/check/:talentId
// @access  Private/Entreprise
export const checkIfFavori = asyncHandler(async (req, res) => {
  const { talentId } = req.params;

  const favori = await Favoris.findOne({
    entreprise: req.user._id,
    talent: talentId,
  });

  res.status(200).json({
    success: true,
    isFavori: !!favori,
    favori: favori || null,
  });
});
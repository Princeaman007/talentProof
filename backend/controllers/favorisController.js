import Favoris from '../models/Favoris.js';
import Talent from '../models/Talent.js';

// @desc    Ajouter un talent aux favoris
// @route   POST /api/entreprise/favoris
// @access  Private/Entreprise
export const addFavori = async (req, res) => {
  try {
    const { talentId, note } = req.body;

    if (!talentId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID du talent est requis',
      });
    }

    // Vérifier que le talent existe
    const talent = await Talent.findById(talentId);
    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent non trouvé',
      });
    }

    // Vérifier si déjà en favoris
    const existingFavori = await Favoris.findOne({
      entreprise: req.user._id,
      talent: talentId,
    });

    if (existingFavori) {
      return res.status(400).json({
        success: false,
        message: 'Ce talent est déjà dans vos favoris',
      });
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
  } catch (error) {
    console.error('Erreur addFavori:', error);
    
    // Gérer l'erreur de doublon (unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ce talent est déjà dans vos favoris',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout aux favoris',
      error: error.message,
    });
  }
};

// @desc    Retirer un talent des favoris
// @route   DELETE /api/entreprise/favoris/:talentId
// @access  Private/Entreprise
export const removeFavori = async (req, res) => {
  try {
    const { talentId } = req.params;

    const favori = await Favoris.findOneAndDelete({
      entreprise: req.user._id,
      talent: talentId,
    });

    if (!favori) {
      return res.status(404).json({
        success: false,
        message: 'Favori non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Talent retiré des favoris',
    });
  } catch (error) {
    console.error('Erreur removeFavori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du favori',
      error: error.message,
    });
  }
};

// @desc    Obtenir tous mes favoris
// @route   GET /api/entreprise/favoris
// @access  Private/Entreprise
export const getFavoris = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Erreur getFavoris:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des favoris',
      error: error.message,
    });
  }
};

// @desc    Modifier la note d'un favori
// @route   PUT /api/entreprise/favoris/:talentId/note
// @access  Private/Entreprise
export const updateFavoriNote = async (req, res) => {
  try {
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
      return res.status(404).json({
        success: false,
        message: 'Favori non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note mise à jour',
      favori,
    });
  } catch (error) {
    console.error('Erreur updateFavoriNote:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la note',
      error: error.message,
    });
  }
};

// @desc    Vérifier si un talent est en favoris
// @route   GET /api/entreprise/favoris/check/:talentId
// @access  Private/Entreprise
export const checkIfFavori = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Erreur checkIfFavori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification',
      error: error.message,
    });
  }
};
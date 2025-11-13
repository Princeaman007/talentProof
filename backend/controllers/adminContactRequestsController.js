import ContactRequest from '../models/ContactRequest.js';

// @desc    Obtenir toutes les demandes de contact
// @route   GET /api/admin/contact-requests
// @access  Private/Admin
export const getAllContactRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      statut = 'all', // all, nouveau, traité
      search = '' 
    } = req.query;

    const skip = (page - 1) * limit;

    // Construire le filtre
    const filter = {};

    if (statut !== 'all') {
      filter.statut = statut;
    }

    if (search) {
      filter.$or = [
        { recruteurNom: { $regex: search, $options: 'i' } },
        { recruteurEmail: { $regex: search, $options: 'i' } },
        { entreprise: { $regex: search, $options: 'i' } },
      ];
    }

    // Récupérer les demandes
    const contactRequests = await ContactRequest.find(filter)
      .populate('talent', 'prenom photo technologies scoreTest disponibilite')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ContactRequest.countDocuments(filter);

    // Statistiques
    const stats = await ContactRequest.aggregate([
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 },
        },
      },
    ]);

    const statsObject = {
      nouveau: 0,
      traité: 0,
      total: 0,
    };

    stats.forEach(stat => {
      statsObject[stat._id] = stat.count;
      statsObject.total += stat.count;
    });

    res.status(200).json({
      success: true,
      contactRequests,
      stats: statsObject,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Erreur getAllContactRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes',
      error: error.message,
    });
  }
};

// @desc    Changer le statut d'une demande de contact
// @route   PUT /api/admin/contact-requests/:id/status
// @access  Private/Admin
export const updateContactRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['nouveau', 'traité'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide. Doit être "nouveau" ou "traité"',
      });
    }

    const contactRequest = await ContactRequest.findById(id)
      .populate('talent', 'prenom technologies');

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande de contact non trouvée',
      });
    }

    contactRequest.statut = statut;
    await contactRequest.save();

    res.status(200).json({
      success: true,
      message: `Statut changé en "${statut}" avec succès`,
      contactRequest,
    });
  } catch (error) {
    console.error('Erreur updateContactRequestStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message,
    });
  }
};

// @desc    Supprimer une demande de contact
// @route   DELETE /api/admin/contact-requests/:id
// @access  Private/Admin
export const deleteContactRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const contactRequest = await ContactRequest.findByIdAndDelete(id);

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande de contact non trouvée',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Demande de contact supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur deleteContactRequest:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message,
    });
  }
};
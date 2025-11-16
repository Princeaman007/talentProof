import Talent from '../models/Talent.js';
import ContactRequest from '../models/Contactrequest.js';
import Company from '../models/Company.js';

/**
 * @route   POST /api/admin/talents
 * @desc    Créer un nouveau talent
 * @access  Private/Admin
 */
export const createTalent = async (req, res) => {
  try {
    console.log('📥 Données reçues dans adminController:', req.body);

    const {
      prenom,
      photo,
      typeProfil,
      niveau,
      typeContrat,
      anneeExperience,
      technologies,
      competences,
      scoreTest,
      plateforme,
      disponibilite,
      localisation,
      langues,
      tarifJournalier,
      portfolio,
      github,
      linkedin,
      statut,
    } = req.body;

    // ✅ Créer le talent avec TOUS les champs
    const talent = await Talent.create({
      prenom,
      photo,
      typeProfil,
      niveau,
      typeContrat,
      anneeExperience,
      technologies,
      competences,
      scoreTest,
      plateforme,
      disponibilite,
      localisation,
      langues,
      tarifJournalier,
      portfolio,
      github,
      linkedin,
      statut: statut || 'actif',
    });

    console.log('✅ Talent créé avec succès:', talent);

    res.status(201).json({
      success: true,
      message: 'Talent créé avec succès.',
      data: talent,
    });
  } catch (error) {
    console.error('❌ Erreur createTalent:', error);
    
    // ✅ Meilleure gestion des erreurs de validation
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        msg: err.message,
        field: err.path
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du talent.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/admin/talents
 * @desc    Obtenir tous les talents (actifs + inactifs) pour admin
 * @access  Private/Admin
 */
export const getAllTalentsAdmin = async (req, res) => {
  try {
    const talents = await Talent.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: talents.length,
      data: talents,
    });
  } catch (error) {
    console.error('Erreur getAllTalentsAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des talents.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/admin/talents/:id
 * @desc    Modifier un talent
 * @access  Private/Admin
 */
export const updateTalent = async (req, res) => {
  try {
    console.log('📝 Mise à jour du talent:', req.params.id);
    console.log('📥 Données reçues:', req.body);

    const talent = await Talent.findById(req.params.id);

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent introuvable.',
      });
    }

    // ✅ Mettre à jour TOUS les champs possibles
    const {
      prenom,
      photo,
      typeProfil,
      niveau,
      typeContrat,
      anneeExperience,
      technologies,
      competences,
      scoreTest,
      plateforme,
      disponibilite,
      localisation,
      langues,
      tarifJournalier,
      portfolio,
      github,
      linkedin,
      statut,
    } = req.body;

    // Mettre à jour uniquement les champs fournis
    if (prenom !== undefined) talent.prenom = prenom;
    if (photo !== undefined) talent.photo = photo;
    if (typeProfil !== undefined) talent.typeProfil = typeProfil;
    if (niveau !== undefined) talent.niveau = niveau;
    if (typeContrat !== undefined) talent.typeContrat = typeContrat;
    if (anneeExperience !== undefined) talent.anneeExperience = anneeExperience;
    if (technologies !== undefined) talent.technologies = technologies;
    if (competences !== undefined) talent.competences = competences;
    if (scoreTest !== undefined) talent.scoreTest = scoreTest;
    if (plateforme !== undefined) talent.plateforme = plateforme;
    if (disponibilite !== undefined) talent.disponibilite = disponibilite;
    if (localisation !== undefined) talent.localisation = localisation;
    if (langues !== undefined) talent.langues = langues;
    if (tarifJournalier !== undefined) talent.tarifJournalier = tarifJournalier;
    if (portfolio !== undefined) talent.portfolio = portfolio;
    if (github !== undefined) talent.github = github;
    if (linkedin !== undefined) talent.linkedin = linkedin;
    if (statut !== undefined) talent.statut = statut;

    await talent.save();

    console.log('✅ Talent mis à jour:', talent);

    res.status(200).json({
      success: true,
      message: 'Talent mis à jour avec succès.',
      data: talent,
    });
  } catch (error) {
    console.error('❌ Erreur updateTalent:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        msg: err.message,
        field: err.path
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du talent.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   DELETE /api/admin/talents/:id
 * @desc    Supprimer un talent
 * @access  Private/Admin
 */
export const deleteTalent = async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);

    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent introuvable.',
      });
    }

    await talent.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Talent supprimé avec succès.',
    });
  } catch (error) {
    console.error('Erreur deleteTalent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du talent.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/admin/contact-requests
 * @desc    Obtenir toutes les demandes de contact
 * @access  Private/Admin
 */
export const getAllContactRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find()
      .populate('talent', 'prenom technologies scoreTest')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Erreur getAllContactRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/admin/contact-requests/:id
 * @desc    Marquer une demande comme traitée
 * @access  Private/Admin
 */
export const updateContactRequestStatus = async (req, res) => {
  try {
    const { statut } = req.body;

    const request = await ContactRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande introuvable.',
      });
    }

    request.statut = statut;
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Statut mis à jour avec succès.',
      data: request,
    });
  } catch (error) {
    console.error('Erreur updateContactRequestStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/admin/entreprises/count
 * @desc    Obtenir le nombre d'entreprises inscrites
 * @access  Private/Admin
 */
export const getEntreprisesCount = async (req, res) => {
  try {
    // ✅ Compter toutes les entreprises inscrites
    const count = await Company.countDocuments();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('❌ Erreur getEntreprisesCount:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du nombre d\'entreprises',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Obtenir les statistiques globales
 * @access  Private/Admin
 */
export const getGlobalStats = async (req, res) => {
  try {
    // Nombre total de talents actifs
    const talentsCount = await Talent.countDocuments({ statut: 'actif' });
    
    // Nombre total de demandes de contact
    const contactRequestsCount = await ContactRequest.countDocuments();
    
    // ✅ Nombre d'entreprises inscrites
    const entreprisesCount = await Company.countDocuments();
    
    // Calculer le taux de succès (% de talents en mission)
    const talentsEnMission = await Talent.countDocuments({ statut: 'en_mission' });
    const tauxSucces = talentsCount > 0 ? Math.round((talentsEnMission / talentsCount) * 100) : 0;

    res.status(200).json({
      success: true,
      talentsCount,
      entreprisesCount,
      contactRequestsCount,
      tauxSucces,
    });
  } catch (error) {
    console.error('❌ Erreur getGlobalStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
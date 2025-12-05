import Talent from '../models/Talent.js';
import ContactRequest from '../models/ContactRequest.js';
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

/**
 * @route   POST /api/admin/talents
 * @desc    Créer un nouveau talent
 * @access  Private/Admin
 */
export const createTalent = asyncHandler(async (req, res) => {

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

  //  Créer le talent avec TOUS les champs
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


  res.status(201).json({
    success: true,
    message: 'Talent créé avec succès.',
    data: talent,
  });
});

/**
 * @route   GET /api/admin/talents
 * @desc    Obtenir tous les talents (actifs + inactifs) pour admin
 * @access  Private/Admin
 */
export const getAllTalentsAdmin = asyncHandler(async (req, res) => {
  const talents = await Talent.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: talents.length,
    data: talents,
  });
});

/**
 * @route   PUT /api/admin/talents/:id
 * @desc    Modifier un talent
 * @access  Private/Admin
 */
export const updateTalent = asyncHandler(async (req, res) => {

  const talent = await Talent.findById(req.params.id);

  if (!talent) {
    throw notFound('Talent');
  }

  //  Mettre à jour TOUS les champs possibles
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


  res.status(200).json({
    success: true,
    message: 'Talent mis à jour avec succès.',
    data: talent,
  });
});

/**
 * @route   DELETE /api/admin/talents/:id
 * @desc    Supprimer un talent
 * @access  Private/Admin
 */
export const deleteTalent = asyncHandler(async (req, res) => {
  const talent = await Talent.findById(req.params.id);

  if (!talent) {
    throw notFound('Talent');
  }

  await talent.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Talent supprimé avec succès.',
  });
});

/**
 * @route   GET /api/admin/contact-requests
 * @desc    Obtenir toutes les demandes de contact
 * @access  Private/Admin
 */
export const getAllContactRequests = asyncHandler(async (req, res) => {
  const requests = await ContactRequest.find()
    .populate('talent', 'prenom technologies scoreTest')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

/**
 * @route   PUT /api/admin/contact-requests/:id
 * @desc    Marquer une demande comme traitée
 * @access  Private/Admin
 */
export const updateContactRequestStatus = asyncHandler(async (req, res) => {
  const { statut } = req.body;

  const request = await ContactRequest.findById(req.params.id);

  if (!request) {
    throw notFound('Demande');
  }

  request.statut = statut;
  await request.save();

  res.status(200).json({
    success: true,
    message: 'Statut mis à jour avec succès.',
    data: request,
  });
});

/**
 * @route   GET /api/admin/entreprises/count
 * @desc    Obtenir le nombre d'entreprises inscrites
 * @access  Private/Admin
 */
export const getEntreprisesCount = asyncHandler(async (req, res) => {
  //  Compter toutes les entreprises inscrites
  const count = await Company.countDocuments();

  res.status(200).json({
    success: true,
    count,
  });
});

/**
 * @route   GET /api/admin/stats
 * @desc    Obtenir les statistiques globales
 * @access  Private/Admin
 */
export const getGlobalStats = asyncHandler(async (req, res) => {
  // Nombre total de talents actifs
  const talentsCount = await Talent.countDocuments({ statut: 'actif' });
  
  // Nombre total de demandes de contact
  const contactRequestsCount = await ContactRequest.countDocuments();
  
  //  Nombre d'entreprises inscrites
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
});
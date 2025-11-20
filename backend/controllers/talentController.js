import Talent from '../models/Talent.js';
import ContactRequest from '../models/ContactRequest.js';
import { sendEmail } from '../utils/emailService.js';
import { contactNotificationTemplate, contactConfirmationTemplate } from '../utils/emailTemplates.js';
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
 * @route   GET /api/talents
 * @desc    Obtenir tous les talents actifs
 * @access  Public
 */
export const getAllTalents = asyncHandler(async (req, res) => {
  const talents = await Talent.find({ statut: 'actif' })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: talents.length,
    data: talents,
  });
});

/**
 * @route   GET /api/talents/filter
 * @desc    Filtrer les talents par critères multiples
 * @access  Public
 */
export const filterTalents = asyncHandler(async (req, res) => {
  const { 
    technologies,
    typeProfil,
    niveau,
    typeContrat,
    disponibilite,
    minScore,
    maxScore,
    experienceMin,
    experienceMax,
    localisation,
    langue,
  } = req.query;

  let query = { statut: 'actif' };

  //  Filtrer par technologies (ancien + amélioré)
  if (technologies) {
    const techArray = Array.isArray(technologies) 
      ? technologies 
      : technologies.split(',').map(tech => tech.trim());
    query.technologies = { $in: techArray };
  }

  //  NOUVEAU - Filtrer par type de profil
  if (typeProfil) {
    query.typeProfil = typeProfil;
  }

  //  NOUVEAU - Filtrer par niveau
  if (niveau) {
    query.niveau = niveau;
  }

  //  NOUVEAU - Filtrer par type de contrat
  if (typeContrat) {
    query.typeContrat = typeContrat;
  }

  //  NOUVEAU - Filtrer par disponibilité
  if (disponibilite) {
    query.disponibilite = disponibilite;
  }

  //  Filtrer par score (ancien)
  if (minScore || maxScore) {
    query.scoreTest = {};
    if (minScore) query.scoreTest.$gte = parseInt(minScore);
    if (maxScore) query.scoreTest.$lte = parseInt(maxScore);
  }

  //  CORRIGÉ - Filtrer par années d'expérience (SANS S)
  if (experienceMin !== undefined || experienceMax !== undefined) {
    query.anneeExperience = {};
    if (experienceMin !== undefined) query.anneeExperience.$gte = parseInt(experienceMin);
    if (experienceMax !== undefined) query.anneeExperience.$lte = parseInt(experienceMax);
  }

  //  NOUVEAU - Filtrer par localisation (recherche partielle)
  if (localisation) {
    query.localisation = { $regex: localisation, $options: 'i' };
  }

  //  NOUVEAU - Filtrer par langue
  if (langue) {
    query.langues = { $in: [langue] };
  }

  const talents = await Talent.find(query).sort({ scoreTest: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: talents.length,
    data: talents,
    filters: req.query, // Retourner les filtres appliqués pour debug
  });
});

/**
 * @route   GET /api/talents/:id
 * @desc    Obtenir un talent par ID
 * @access  Public
 */
export const getTalentById = asyncHandler(async (req, res) => {
  const talent = await Talent.findById(req.params.id);

  if (!talent) {
    throw notFound('Talent');
  }

  if (talent.statut !== 'actif') {
    throw new AppError('Ce talent n\'est plus disponible.', 'TALENT_INACTIVE', 404);
  }

  res.status(200).json({
    success: true,
    data: talent,
  });
});

/**
 * @route   POST /api/talents/contact
 * @desc    Demander le contact d'un talent (envoie email à Prince)
 * @access  Public
 */
export const contactTalent = asyncHandler(async (req, res) => {
  const { talentId, recruteurNom, recruteurEmail, recruteurTel, entreprise, message } = req.body;

  // Vérifier que le talent existe et est actif
  const talent = await Talent.findById(talentId);

  if (!talent) {
    throw notFound('Talent');
  }

  if (talent.statut !== 'actif') {
    throw new AppError('Ce talent n\'est plus disponible.', 'TALENT_INACTIVE', 400);
  }

  // Créer la demande de contact
  const contactRequest = await ContactRequest.create({
    talent: talentId,
    recruteurNom,
    recruteurEmail,
    recruteurTel,
    entreprise,
    message,
  });

  //  CORRIGÉ - Préparer les données pour l'email à Prince (SANS S)
  const talentInfo = {
    prenom: talent.prenom,
    typeProfil: talent.typeProfil,
    niveau: talent.niveau,
    typeContrat: talent.typeContrat,
    anneeExperience: talent.anneeExperience, //  SANS S
    technologies: talent.technologies,
    scoreTest: talent.scoreTest,
    plateforme: talent.plateforme,
    disponibilite: talent.disponibilite,
    localisation: talent.localisation,
  };

  const recruteurInfo = {
    nom: recruteurNom,
    email: recruteurEmail,
    tel: recruteurTel,
    entreprise,
    message,
  };

  // Envoyer l'email de notification à Prince
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@princeaman.dev',
      subject: `[TalentProof] Nouvelle demande de contact pour ${talent.prenom} (${talent.typeProfil} ${talent.niveau})`,
      html: contactNotificationTemplate(talentInfo, recruteurInfo),
    });
  } catch (emailError) {
    console.error('Erreur envoi email à Prince:', emailError);
  }

  // Envoyer un email de confirmation au recruteur
  try {
    await sendEmail({
      to: recruteurEmail,
      subject: 'Votre demande a été reçue - TalentProof',
      html: contactConfirmationTemplate(recruteurNom, talent.prenom),
    });
  } catch (emailError) {
    console.error('Erreur envoi email au recruteur:', emailError);
  }

  res.status(201).json({
    success: true,
    message: 'Demande envoyée avec succès ! Nous vous contacterons sous 24-48h.',
    data: contactRequest,
  });
});

/**
 * @route   GET /api/talents/stats
 * @desc    Obtenir des statistiques sur les talents
 * @access  Public
 */
export const getTalentsStats = asyncHandler(async (req, res) => {
  // Compter par type de profil
  const profilStats = await Talent.aggregate([
    { $match: { statut: 'actif' } },
    { $group: { _id: '$typeProfil', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Compter par niveau
  const niveauStats = await Talent.aggregate([
    { $match: { statut: 'actif' } },
    { $group: { _id: '$niveau', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Compter par type de contrat
  const contratStats = await Talent.aggregate([
    { $match: { statut: 'actif' } },
    { $group: { _id: '$typeContrat', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Technologies les plus demandées (top 10)
  const techStats = await Talent.aggregate([
    { $match: { statut: 'actif' } },
    { $unwind: '$technologies' },
    { $group: { _id: '$technologies', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Score moyen
  const avgScoreResult = await Talent.aggregate([
    { $match: { statut: 'actif' } },
    { $group: { _id: null, avgScore: { $avg: '$scoreTest' } } }
  ]);

  const avgScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

  // Total talents
  const totalTalents = await Talent.countDocuments({ statut: 'actif' });

  res.status(200).json({
    success: true,
    data: {
      total: totalTalents,
      avgScore,
      byProfil: profilStats,
      byNiveau: niveauStats,
      byContrat: contratStats,
      topTechnologies: techStats,
    },
  });
});
/**
 * @route   POST /api/admin/talents
 * @desc    Créer un nouveau talent (Admin seulement)
 * @access  Private/Admin
 */
export const createTalent = asyncHandler(async (req, res) => {
  console.log(' Données reçues dans le backend:', req.body);

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

  // Validation basique
  if (!prenom || !technologies || technologies.length === 0 || !competences) {
    throw validationError('Champs obligatoires manquants', [
      { msg: 'Le prénom, les technologies et les compétences sont obligatoires' }
    ]);
  }

  // Créer le talent
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
    statut,
  });

  console.log(' Talent créé:', talent);

  res.status(201).json({
    success: true,
    message: 'Talent créé avec succès',
    data: talent,
  });
});
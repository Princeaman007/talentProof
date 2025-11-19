import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import TalentDay from '../models/Talentday.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { 
  sendEmail, 
  talentDayConfirmationTemplate,
  talentDayAcceptationTemplate,
  talentDayRefusTemplate
} from '../utils/emailService.js';

const router = express.Router();

// CONFIGURATION MULTER pour upload images TalentDay
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/talentdays';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'talentday-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadTalentDayImage = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
  }
});

/**
 * @route   GET /api/talent-days
 * @desc    Obtenir tous les TalentDays publics
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { statut, technologie, type, date } = req.query;
    
    // Construire le filtre
    const filter = { published: true };
    
    if (statut) {
      filter.statut = statut;
    }
    
    if (technologie) {
      filter.technologies = { $in: [technologie] };
    }
    
    if (type) {
      filter.typeEvenement = type;
    }
    
    if (date) {
      // Filtrer par mois (format: YYYY-MM)
      const [year, month] = date.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    const talentDays = await TalentDay.find(filter)
      .sort({ date: 1 }) // Trier par date croissante
      .select('-inscriptions') // Ne pas exposer les inscriptions
      .lean();
    
    res.status(200).json({
      success: true,
      count: talentDays.length,
      data: talentDays,
    });
  } catch (error) {
    console.error('Erreur récupération TalentDays:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
    });
  }
});

/**
 * @route   GET /api/talent-days/upcoming
 * @desc    Obtenir les prochains TalentDays (max 6)
 * @access  Public
 */
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    
    const talentDays = await TalentDay.find({
      published: true,
      date: { $gte: now },
      statut: { $ne: 'annule' },
    })
      .sort({ date: 1 })
      .limit(6)
      .select('-inscriptions')
      .lean();
    
    res.status(200).json({
      success: true,
      count: talentDays.length,
      data: talentDays,
    });
  } catch (error) {
    console.error('Erreur récupération prochains TalentDays:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
    });
  }
});

/**
 * @route   GET /api/talent-days/past
 * @desc    Obtenir les TalentDays passés
 * @access  Public
 */
router.get('/past', async (req, res) => {
  try {
    const now = new Date();
    
    const talentDays = await TalentDay.find({
      published: true,
      date: { $lt: now },
      statut: 'termine',
    })
      .sort({ date: -1 }) // Les plus récents en premier
      .limit(20)
      .select('-inscriptions')
      .lean();
    
    res.status(200).json({
      success: true,
      count: talentDays.length,
      data: talentDays,
    });
  } catch (error) {
    console.error('Erreur récupération TalentDays passés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
    });
  }
});

/**
 * @route   POST /api/talent-days/:id/register
 * @desc    S'inscrire à un TalentDay
 * @access  Public
 */

/**
 * @route   POST /api/talent-days/:id/register
 * @desc    S'inscrire à un TalentDay
 * @access  Public
 */
router.post('/:id/register', async (req, res) => {
  try {
    const { nom, email, telephone, motivation } = req.body;
    
    // Validation des champs requis
    if (!nom || nom.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le nom complet est requis',
      });
    }
    
    if (!email || email.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'L\'email est requis',
      });
    }
    
    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide',
      });
    }
    
    // Validation motivation
    if (!motivation || motivation.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La motivation est requise',
      });
    }
    
    if (motivation.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'La motivation doit contenir au moins 50 caractères',
      });
    }
    
    const talentDay = await TalentDay.findById(req.params.id);
    
    if (!talentDay) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }
    
    // Ensure placesRestantes is properly initialized
    if (!talentDay.placesRestantes) {
      talentDay.placesRestantes = talentDay.placesDisponibles || 0;
    }
    
    // Vérifier si les inscriptions sont ouvertes
    if (!talentDay.canRegister()) {
      return res.status(400).json({
        success: false,
        message: 'Les inscriptions sont fermées pour cet événement',
      });
    }
    
    // Vérifier si déjà inscrit
    const dejaInscrit = talentDay.inscriptions.some(
      inscription => inscription.email.toLowerCase() === email.toLowerCase()
    );
    
    if (dejaInscrit) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà inscrit à cet événement',
      });
    }
    
    // Préparer les données d'inscription
    const inscriptionData = {
      nom: nom.trim(),
      email: email.trim().toLowerCase(),
      telephone: telephone?.trim() || '',
      motivation: motivation.trim(),
      statut: 'en-attente',
      dateInscription: new Date(),
    };
    
    // ✅ ATOMIC UPDATE - Use MongoDB atomic operators to avoid race conditions
    const updatedTalentDay = await TalentDay.findByIdAndUpdate(
      req.params.id,
      {
        $push: { inscriptions: inscriptionData },
        $inc: { placesRestantes: -1 },
      },
      { new: true, runValidators: false }
    );
    
    // Update status if necessary (complet or other)
    if (updatedTalentDay.placesRestantes === 0) {
      updatedTalentDay.statut = 'complet';
      await updatedTalentDay.save();
    }
    
    // ✅ ENVOYER L'EMAIL DE CONFIRMATION
    try {
      const emailHtml = talentDayConfirmationTemplate(inscriptionData, updatedTalentDay);
      await sendEmail({
        to: inscriptionData.email,
        subject: `✅ Inscription confirmée - ${updatedTalentDay.titre}`,
        html: emailHtml,
      });
      console.log('✅ Email de confirmation envoyé à:', inscriptionData.email);
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError);
      // Ne pas bloquer l'inscription si l'email échoue
    }
    
    res.status(201).json({
      success: true,
      message: 'Inscription enregistrée avec succès ! Vous recevrez une confirmation par email.',
    });
  } catch (error) {
    console.error('Erreur inscription TalentDay:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
    });
  }
});

/**
 * @route   GET /api/talent-days/stats/general
 * @desc    Obtenir les statistiques générales
 * @access  Public
 */
router.get('/stats/general', async (req, res) => {
  try {
    const totalEvenements = await TalentDay.countDocuments({ published: true });
    
    const totalParticipants = await TalentDay.aggregate([
      { $match: { published: true, statut: 'termine' } },
      { $group: { _id: null, total: { $sum: '$resultats.nombreParticipants' } } },
    ]);
    
    const totalTalentsValides = await TalentDay.aggregate([
      { $match: { published: true, statut: 'termine' } },
      { $group: { _id: null, total: { $sum: '$resultats.talentsValides' } } },
    ]);
    
    const prochainsEvenements = await TalentDay.countDocuments({
      published: true,
      date: { $gte: new Date() },
      statut: { $ne: 'annule' },
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalEvenements,
        totalParticipants: totalParticipants[0]?.total || 0,
        totalTalentsValides: totalTalentsValides[0]?.total || 0,
        prochainsEvenements,
      },
    });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
    });
  }
});

// ==================== ROUTES ADMIN ====================

/**
 * @route   GET /api/talent-days/admin/all
 * @desc    Obtenir tous les TalentDays avec inscriptions (admin)
 * @access  Admin
 */
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const talentDays = await TalentDay.find({})
      .sort({ date: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: talentDays.length,
      data: talentDays,
    });
  } catch (error) {
    console.error('Erreur récupération TalentDays admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
    });
  }
});

/**
 * @route   POST /api/talent-days
 * @desc    Créer un TalentDay
 * @access  Admin
 */
router.post('/', protect, adminOnly, uploadTalentDayImage.single('image'), async (req, res) => {
  try {
    // Préparer les données du TalentDay
    const talentDayData = { ...req.body };
    
    // Supprimer le champ image s'il est vide ou invalide
    if (!talentDayData.image || typeof talentDayData.image === 'object') {
      delete talentDayData.image;
    }
    
    // Si un fichier est uploadé, utiliser son chemin
    if (req.file) {
      talentDayData.image = `/uploads/talentdays/${req.file.filename}`;
    }
    
    // Parser les champs JSON si nécessaire (quand envoyé via FormData)
    if (typeof talentDayData.lieu === 'string') {
      talentDayData.lieu = JSON.parse(talentDayData.lieu);
    }
    if (typeof talentDayData.technologies === 'string') {
      try {
        talentDayData.technologies = JSON.parse(talentDayData.technologies);
      } catch (e) {
        // Si c'est une string simple séparée par des virgules
        talentDayData.technologies = talentDayData.technologies.split(',').map(t => t.trim()).filter(t => t);
      }
    }
    if (typeof talentDayData.infoEntreprises === 'string') {
      try {
        talentDayData.infoEntreprises = JSON.parse(talentDayData.infoEntreprises);
      } catch (e) {
        console.error('Erreur parsing infoEntreprises:', e);
      }
    }
    if (typeof talentDayData.organisateur === 'string') {
      try {
        talentDayData.organisateur = JSON.parse(talentDayData.organisateur);
      } catch (e) {
        console.error('Erreur parsing organisateur:', e);
      }
    }
    
    const talentDay = await TalentDay.create(talentDayData);
    
    res.status(201).json({
      success: true,
      message: 'TalentDay créé avec succès',
      data: talentDay,
    });
  } catch (error) {
    console.error('Erreur création TalentDay:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la création',
    });
  }
});

/**
 * @route   PUT /api/talent-days/:id
 * @desc    Modifier un TalentDay
 * @access  Admin
 */
router.put('/:id', protect, adminOnly, uploadTalentDayImage.single('image'), async (req, res) => {
  try {
    // Récupérer le TalentDay existant d'abord
    const existingTalentDay = await TalentDay.findById(req.params.id);
    if (!existingTalentDay) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }
    
    // Préparer les données de mise à jour
    const updateData = { ...req.body };
    
    // Gestion de l'image
    if (req.file) {
      // Nouveau fichier uploadé : utiliser le nouveau chemin
      updateData.image = `/uploads/talentdays/${req.file.filename}`;
    } else if (updateData.keepExistingImage === 'true' && updateData.existingImageUrl) {
      // Conserver l'image existante
      updateData.image = updateData.existingImageUrl;
    } else if (!updateData.image || typeof updateData.image === 'object') {
      // Pas de nouvelle image et pas de conservation explicite : garder l'ancienne
      updateData.image = existingTalentDay.image;
    }
    
    // Nettoyer les champs temporaires
    delete updateData.keepExistingImage;
    delete updateData.existingImageUrl;
    
    // Parser les champs JSON si nécessaire (quand envoyé via FormData)
    if (typeof updateData.lieu === 'string') {
      updateData.lieu = JSON.parse(updateData.lieu);
    }
    if (typeof updateData.technologies === 'string') {
      try {
        updateData.technologies = JSON.parse(updateData.technologies);
      } catch (e) {
        updateData.technologies = updateData.technologies.split(',').map(t => t.trim()).filter(t => t);
      }
    }
    if (typeof updateData.infoEntreprises === 'string') {
      try {
        updateData.infoEntreprises = JSON.parse(updateData.infoEntreprises);
      } catch (e) {
        console.error('Erreur parsing infoEntreprises:', e);
      }
    }
    if (typeof updateData.organisateur === 'string') {
      try {
        updateData.organisateur = JSON.parse(updateData.organisateur);
      } catch (e) {
        console.error('Erreur parsing organisateur:', e);
      }
    }
    
    const talentDay = await TalentDay.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'TalentDay modifié avec succès',
      data: talentDay,
    });
  } catch (error) {
    console.error('Erreur modification TalentDay:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la modification',
    });
  }
});

/**
 * @route   DELETE /api/talent-days/:id
 * @desc    Supprimer un TalentDay
 * @access  Admin
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const talentDay = await TalentDay.findByIdAndDelete(req.params.id);
    
    if (!talentDay) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'TalentDay supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur suppression TalentDay:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
    });
  }
});

/**
 * @route   GET /api/talent-days/:id/inscriptions
 * @desc    Obtenir les inscriptions d'un TalentDay
 * @access  Admin
 */
router.get('/:id/inscriptions', protect, adminOnly, async (req, res) => {
  try {
    const talentDay = await TalentDay.findById(req.params.id);
    
    if (!talentDay) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }
    
    res.status(200).json({
      success: true,
      count: talentDay.inscriptions.length,
      data: talentDay.inscriptions,
    });
  } catch (error) {
    console.error('Erreur récupération inscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des inscriptions',
    });
  }
});

/**
 * @route   PUT /api/talent-days/:id/inscriptions/:inscriptionIndex
 * @desc    Mettre à jour le statut d'une inscription
 * @access  Admin
 */
router.put('/:id/inscriptions/:inscriptionIndex', protect, adminOnly, async (req, res) => {
  try {
    const { id, inscriptionIndex } = req.params;
    const { statut } = req.body;
    
    // Validation du statut
    const statutsValides = ['en-attente', 'accepte', 'refuse', 'liste-attente'];
    if (!statut || !statutsValides.includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide',
      });
    }
    
    // Récupérer le TalentDay
    const talentDay = await TalentDay.findById(id);
    
    if (!talentDay) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }
    
    // Vérifier que l'index est valide
    const index = parseInt(inscriptionIndex);
    if (isNaN(index) || index < 0 || index >= talentDay.inscriptions.length) {
      return res.status(400).json({
        success: false,
        message: 'Index d\'inscription invalide',
      });
    }
    
    // Récupérer l'inscription avant mise à jour
    const inscription = talentDay.inscriptions[index];
    const ancienStatut = inscription.statut;
    
    // Mettre à jour le statut
    talentDay.inscriptions[index].statut = statut;
    await talentDay.save();
    
    // Envoyer email si le statut a changé et n'est plus "en-attente"
    let emailEnvoye = false;
    if (ancienStatut !== statut && (statut === 'accepte' || statut === 'refuse')) {
      try {
        let emailSubject = '';
        let emailHtml = '';
        
        if (statut === 'accepte') {
          emailSubject = `✅ Félicitations ! Vous êtes accepté(e) - ${talentDay.titre}`;
          emailHtml = talentDayAcceptationTemplate(inscription, talentDay);
        } else if (statut === 'refuse') {
          emailSubject = `Réponse à votre candidature - ${talentDay.titre}`;
          emailHtml = talentDayRefusTemplate(inscription, talentDay);
        }
        
        await sendEmail({
          to: inscription.email,
          subject: emailSubject,
          html: emailHtml,
        });
        
        console.log(`✅ Email de ${statut} envoyé à:`, inscription.email);
        emailEnvoye = true;
      } catch (emailError) {
        console.error('❌ Erreur envoi email:', emailError);
        // Ne pas bloquer la mise à jour si l'email échoue
      }
    }
    
    // Message personnalisé pour la réponse
    const dateEvent = new Date(talentDay.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    let message = '';
    if (statut === 'accepte') {
      message = `✅ Vous avez accepté ${inscription.nom} pour le Talent Day "${talentDay.titre}" du ${dateEvent}`;
    } else if (statut === 'refuse') {
      message = `❌ Vous avez refusé ${inscription.nom} pour le Talent Day "${talentDay.titre}"`;
    } else if (statut === 'liste-attente') {
      message = `📋 ${inscription.nom} a été placé(e) en liste d'attente pour "${talentDay.titre}"`;
    } else {
      message = `⏳ ${inscription.nom} est maintenant en attente pour "${talentDay.titre}"`;
    }
    
    if (emailEnvoye) {
      message += ' - Email de notification envoyé';
    }
    
    res.status(200).json({
      success: true,
      message: message,
      data: talentDay.inscriptions[index],
      emailEnvoye: emailEnvoye,
    });
  } catch (error) {
    console.error('Erreur mise à jour statut inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
    });
  }
});

/**
 * @route   GET /api/talent-days/:id
 * @desc    Obtenir un TalentDay spécifique
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const talentDay = await TalentDay.findById(req.params.id)
      .select('-inscriptions')
      .lean();
    
    if (!talentDay) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé',
      });
    }
    
    if (!talentDay.published) {
      return res.status(404).json({
        success: false,
        message: 'Événement non disponible',
      });
    }
    
    res.status(200).json({
      success: true,
      data: talentDay,
    });
  } catch (error) {
    console.error('Erreur récupération TalentDay:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'événement',
    });
  }
});

export default router;
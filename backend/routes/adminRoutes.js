import express from 'express';
import {
  createTalent,
  getAllTalentsAdmin,
  updateTalent,
  deleteTalent,
  getAllContactRequests,
  updateContactRequestStatus,
  getEntreprisesCount, 
  getGlobalStats,
} from '../controllers/adminController.js';
import Portfolio from '../models/Portfolio.js';
import Devis from '../models/Devis.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { talentValidation } from '../utils/Validation.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Toutes les routes admin nécessitent authentification + droits admin
router.use(protect);
router.use(adminOnly);

// ==================== CONFIGURATION MULTER ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/portfolio';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'portfolio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
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

// ==================== GESTION DES TALENTS ====================
router.post('/talents', talentValidation, createTalent);
router.get('/talents', getAllTalentsAdmin);
router.put('/talents/:id', updateTalent);
router.delete('/talents/:id', deleteTalent);

// ==================== GESTION DES DEMANDES DE CONTACT ====================
router.get('/contact-requests', getAllContactRequests);
router.put('/contact-requests/:id', updateContactRequestStatus);

// ==================== STATISTIQUES GLOBALES ====================
router.get('/entreprises/count', getEntreprisesCount);
router.get('/stats', getGlobalStats);

// ==================== GESTION PORTFOLIO ====================

// GET /api/admin/portfolio - Obtenir tous les projets (incluant inactifs)
router.get('/portfolio', async (req, res) => {
  try {
    const { statut, categorie } = req.query;
    
    let query = {};
    
    if (statut) {
      query.statut = statut;
    }
    
    if (categorie) {
      query.categorie = categorie;
    }
    
    const projets = await Portfolio.find(query).sort({ ordre: 1, createdAt: -1 });
    
    res.json({
      success: true,
      count: projets.length,
      data: projets
    });
  } catch (error) {
    console.error('Erreur récupération portfolio:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du portfolio',
      error: error.message
    });
  }
});

// POST /api/admin/portfolio - Créer un nouveau projet
router.post('/portfolio', upload.single('screenshot'), async (req, res) => {
  try {
    const {
      titre,
      description,
      descriptionLongue,
      client,
      technologies,
      categorie,
      url,
      dateRealisation,
      duree,
      ordre,
      featured
    } = req.body;
    
    if (!titre || !description || !categorie) {
      return res.status(400).json({
        success: false,
        message: 'Titre, description et catégorie sont requis'
      });
    }
    
    const screenshotUrl = req.file ? `/uploads/portfolio/${req.file.filename}` : '';
    
    if (!screenshotUrl) {
      return res.status(400).json({
        success: false,
        message: 'Le screenshot est requis'
      });
    }
    
    const nouveauProjet = new Portfolio({
      titre,
      description,
      descriptionLongue,
      client,
      screenshot: screenshotUrl,
      technologies: typeof technologies === 'string' ? JSON.parse(technologies) : technologies,
      categorie,
      url,
      dateRealisation,
      duree,
      ordre: ordre || 0,
      featured: featured === 'true' || featured === true
    });
    
    await nouveauProjet.save();
    
    res.status(201).json({
      success: true,
      message: 'Projet créé avec succès',
      data: nouveauProjet
    });
    
  } catch (error) {
    console.error('Erreur création projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du projet',
      error: error.message
    });
  }
});

// PUT /api/admin/portfolio/:id - Modifier un projet
router.put('/portfolio/:id', upload.single('screenshot'), async (req, res) => {
  try {
    const projet = await Portfolio.findById(req.params.id);
    
    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    const {
      titre,
      description,
      descriptionLongue,
      client,
      technologies,
      categorie,
      url,
      dateRealisation,
      duree,
      statut,
      ordre,
      featured
    } = req.body;
    
    // Mettre à jour les champs
    if (titre) projet.titre = titre;
    if (description) projet.description = description;
    if (descriptionLongue !== undefined) projet.descriptionLongue = descriptionLongue;
    if (client !== undefined) projet.client = client;
    if (technologies) {
      projet.technologies = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
    }
    if (categorie) projet.categorie = categorie;
    if (url !== undefined) projet.url = url;
    if (dateRealisation) projet.dateRealisation = dateRealisation;
    if (duree !== undefined) projet.duree = duree;
    if (statut) projet.statut = statut;
    if (ordre !== undefined) projet.ordre = ordre;
    if (featured !== undefined) projet.featured = featured === 'true' || featured === true;
    
    // Mettre à jour le screenshot si un nouveau fichier est fourni
    if (req.file) {
      // Supprimer l'ancien fichier
      if (projet.screenshot) {
        const oldPath = path.join(process.cwd(), projet.screenshot);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      projet.screenshot = `/uploads/portfolio/${req.file.filename}`;
    }
    
    await projet.save();
    
    res.json({
      success: true,
      message: 'Projet modifié avec succès',
      data: projet
    });
    
  } catch (error) {
    console.error('Erreur modification projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du projet',
      error: error.message
    });
  }
});

// DELETE /api/admin/portfolio/:id - Supprimer un projet
router.delete('/portfolio/:id', async (req, res) => {
  try {
    const projet = await Portfolio.findById(req.params.id);
    
    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    // Supprimer le fichier screenshot
    if (projet.screenshot) {
      const filePath = path.join(process.cwd(), projet.screenshot);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Supprimer les images supplémentaires
    if (projet.images && projet.images.length > 0) {
      projet.images.forEach(imgUrl => {
        const imgPath = path.join(process.cwd(), imgUrl);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }
    
    await Portfolio.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Projet supprimé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur suppression projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du projet',
      error: error.message
    });
  }
});

// ==================== GESTION DEVIS ====================

// GET /api/admin/devis - Obtenir toutes les demandes de devis
router.get('/devis', async (req, res) => {
  try {
    const { statut, typeProjet, priorite } = req.query;
    
    let query = {};
    
    if (statut) {
      query.statut = statut;
    }
    
    if (typeProjet) {
      query.typeProjet = typeProjet;
    }
    
    if (priorite) {
      query.priorite = priorite;
    }
    
    const devis = await Devis.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: devis.length,
      data: devis
    });
  } catch (error) {
    console.error('Erreur récupération devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des devis',
      error: error.message
    });
  }
});

// GET /api/admin/devis/stats/overview - Statistiques des devis (AVANT la route /:id)
router.get('/devis/stats/overview', async (req, res) => {
  try {
    const totalDevis = await Devis.countDocuments();
    const nouveaux = await Devis.countDocuments({ statut: 'nouveau' });
    const enCours = await Devis.countDocuments({ statut: 'en-cours' });
    const acceptes = await Devis.countDocuments({ statut: 'accepte' });
    
    const parTypeProjet = await Devis.aggregate([
      { $group: { _id: '$typeProjet', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalDevis,
        nouveaux,
        enCours,
        acceptes,
        parTypeProjet
      }
    });
  } catch (error) {
    console.error('Erreur statistiques devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

// GET /api/admin/devis/:id - Obtenir un devis spécifique
router.get('/devis/:id', async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id);
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: devis
    });
  } catch (error) {
    console.error('Erreur récupération devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du devis',
      error: error.message
    });
  }
});

// PUT /api/admin/devis/:id - Mettre à jour un devis
router.put('/devis/:id', async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id);
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    const { statut, priorite, notesInternes, devisEnvoye } = req.body;
    
    if (statut) devis.statut = statut;
    if (priorite) devis.priorite = priorite;
    if (notesInternes !== undefined) devis.notesInternes = notesInternes;
    if (devisEnvoye) devis.devisEnvoye = devisEnvoye;
    
    await devis.save();
    
    res.json({
      success: true,
      message: 'Devis mis à jour avec succès',
      data: devis
    });
    
  } catch (error) {
    console.error('Erreur mise à jour devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du devis',
      error: error.message
    });
  }
});

// DELETE /api/admin/devis/:id - Supprimer un devis
router.delete('/devis/:id', async (req, res) => {
  try {
    const devis = await Devis.findByIdAndDelete(req.params.id);
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Devis supprimé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur suppression devis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du devis',
      error: error.message
    });
  }
});

export default router;
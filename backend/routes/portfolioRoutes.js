import express from 'express';
import Portfolio from '../models/Portfolio.js';

const router = express.Router();

// GET /api/portfolio - Obtenir tous les projets actifs
router.get('/', async (req, res) => {
  try {
    const { categorie, featured, limit } = req.query;
    
    let query = { statut: 'actif' };
    
    // Filtrer par catégorie
    if (categorie && categorie !== 'tous') {
      query.categorie = categorie;
    }
    
    // Filtrer les projets featured
    if (featured === 'true') {
      query.featured = true;
    }
    
    let portfolioQuery = Portfolio.find(query)
      .sort({ ordre: 1, createdAt: -1 });
    
    // Limiter le nombre de résultats
    if (limit) {
      portfolioQuery = portfolioQuery.limit(parseInt(limit));
    }
    
    const projets = await portfolioQuery;
    
    res.json({
      success: true,
      count: projets.length,
      data: projets
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du portfolio:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets',
      error: error.message
    });
  }
});

// GET /api/portfolio/categories - Obtenir les catégories disponibles
router.get('/categories', async (req, res) => {
  try {
    const categories = await Portfolio.distinct('categorie', { statut: 'actif' });
    
    // Labels français pour les catégories
    const categoriesLabels = {
      'site-vitrine': 'Sites Vitrines',
      'e-commerce': 'E-commerce',
      'app-mobile': 'Applications Mobiles',
      'app-web': 'Applications Web',
      'dashboard': 'Dashboards',
      'autre': 'Autres'
    };
    
    const categoriesAvecLabels = categories.map(cat => ({
      value: cat,
      label: categoriesLabels[cat] || cat
    }));
    
    res.json({
      success: true,
      data: categoriesAvecLabels
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
});

// GET /api/portfolio/:id - Obtenir un projet spécifique
router.get('/:id', async (req, res) => {
  try {
    const projet = await Portfolio.findById(req.params.id);
    
    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    // Incrémenter le compteur de vues
    projet.vues += 1;
    await projet.save();
    
    res.json({
      success: true,
      data: projet
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du projet',
      error: error.message
    });
  }
});

// GET /api/portfolio/stats/overview - Statistiques publiques
router.get('/stats/overview', async (req, res) => {
  try {
    const totalProjets = await Portfolio.countDocuments({ statut: 'actif' });
    const categoriesCount = await Portfolio.aggregate([
      { $match: { statut: 'actif' } },
      { $group: { _id: '$categorie', count: { $sum: 1 } } }
    ]);
    
    const technologiesUtilisees = await Portfolio.aggregate([
      { $match: { statut: 'actif' } },
      { $unwind: '$technologies' },
      { $group: { _id: '$technologies', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalProjets,
        categoriesCount,
        technologiesPopulaires: technologiesUtilisees
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

export default router;
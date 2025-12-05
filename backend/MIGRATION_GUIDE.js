/**
 * MIGRATION GUIDE: Refactoriser les contrôleurs pour utiliser les Services
 * 
 * Exemple: authController.js
 */

// ============ AVANT ============
// authController.js (OLD - 469 lignes)
import Company from '../models/Company.js';
import { hashPassword, comparePassword, generateToken } from '../utils/Auth.js';
import { sendEmail } from '../utils/Email.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver entreprise
    const company = await Company.findOne({ email }).select('+password');
    if (!company) {
      return res.status(401).json({ success: false, message: 'Incorrect credentials' });
    }

    // Vérifier password
    const isValid = await comparePassword(password, company.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Incorrect credentials' });
    }

    // Vérifier email confirmé
    if (!company.isConfirmed) {
      return res.status(403).json({ success: false, message: 'Email not confirmed' });
    }

    // Vérifier compte actif
    if (company.isActive === false) {
      return res.status(403).json({ success: false, message: 'Account suspended' });
    }

    // Mettre à jour lastLogin
    company.lastLogin = new Date();
    await company.save();

    // Générer token
    const token = generateToken({ id: company._id });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: company._id,
        nom: company.nom,
        email: company.email,
        role: company.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============ APRÈS ============
// authController.js (NEW - 15 lignes)
import { loginService } from '../services/authService.js';
import { setTokenCookie } from '../utils/cookieConfig.js';
import { logger } from '../utils/logger.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Logique métier déléguée au service
    const result = await loginService(email, password);
    
    // Envoyer le token via cookie HttpOnly
    setTokenCookie(res, result.token);
    
    // Logger l'action
    logger.info('User login successful', { email });
    
    // Répondre au client
    res.status(200).json({
      success: true,
      data: result.company,
    });
  } catch (error) {
    // errorHandler prend le relais (middleware global)
    next(error);
  }
};

/**
 * MIGRATION STEP-BY-STEP
 * 
 * 1. Pour chaque contrôleur:
 * 
 *    a) Identifier la logique métier:
 *       - Requêtes DB
 *       - Validations
 *       - Calculs
 *    
 *    b) Créer un service correspondant:
 *       services/talentService.js
 *       services/portfolioService.js
 *       services/devisService.js
 *    
 *    c) Extraire la logique dans le service
 *    
 *    d) Simplifier le contrôleur (10-15 lignes max)
 * 
 * 2. Utiliser les classes d'erreur:
 * 
 *    import { ValidationError, NotFoundError } from '../utils/errorHandler.js';
 *    
 *    // Dans le service:
 *    if (!data) throw new NotFoundError('Resource');
 *    if (invalid) throw new ValidationError('Invalid input');
 * 
 * 3. Logger les actions importantes:
 * 
 *    import { logger } from '../utils/logger.js';
 *    
 *    logger.info('Action completed', { userId, action });
 *    logger.error('Action failed', { error: error.message });
 * 
 * 4. Utiliser pagination partout:
 * 
 *    import { getPaginationParams } from '../utils/pagination.js';
 *    
 *    const { page, limit, skip } = getPaginationParams(req.query);
 *    const items = await Model.find({}).skip(skip).limit(limit);
 */

// ============ EXEMPLE REFACTORISATION TALENT ============

// AVANT (talentController.js - 200+ lignes mélangées)
export const getAllTalents = async (req, res) => {
  try {
    const { page = 1, limit = 10, typeProfil, niveau, search } = req.query;
    
    // Construire le filtre
    const filter = {};
    if (typeProfil) filter.typeProfil = typeProfil;
    if (niveau) filter.niveau = niveau;
    if (search) {
      filter.$or = [
        { prenom: { $regex: search, $options: 'i' } },
        { competences: { $regex: search, $options: 'i' } },
      ];
    }

    // Requête
    const skip = (page - 1) * limit;
    const talents = await Talent.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Talent.countDocuments(filter);

    res.status(200).json({
      success: true,
      talents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

// APRÈS (talentController.js - 15 lignes)
import { getAllTalentsService } from '../services/talentService.js';
import { getPaginationParams } from '../utils/pagination.js';

export const getAllTalents = async (req, res, next) => {
  try {
    const pagination = getPaginationParams(req.query);
    const result = await getAllTalentsService({
      filters: {
        typeProfil: req.query.typeProfil,
        niveau: req.query.niveau,
        search: req.query.search,
      },
      pagination,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// Service (services/talentService.js):
import { getPaginationParams, buildPaginatedResponse } from '../utils/pagination.js';
import { NotFoundError } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';

export const getAllTalentsService = async ({ filters, pagination }) => {
  const buildFilter = () => {
    const filter = { statut: 'actif' };
    if (filters.typeProfil) filter.typeProfil = filters.typeProfil;
    if (filters.niveau) filter.niveau = filters.niveau;
    if (filters.search) {
      filter.$or = [
        { prenom: { $regex: filters.search, $options: 'i' } },
        { competences: { $regex: filters.search, $options: 'i' } },
      ];
    }
    return filter;
  };

  const filter = buildFilter();
  const talents = await Talent.find(filter)
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit);

  const total = await Talent.countDocuments(filter);

  logger.info('Talents fetched', { count: talents.length, total });

  return buildPaginatedResponse(talents, total, pagination);
};

/**
 * CHECKLIST MIGRATION
 * 
 * [ ] Créer services/authService.js 
 * [ ] Créer services/talentService.js
 * [ ] Créer services/portfolioService.js
 * [ ] Créer services/teamService.js
 * [ ] Créer services/devisService.js
 * [ ] Refactoriser talentController.js
 * [ ] Refactoriser portfolioController.js
 * [ ] Refactoriser teamController.js
 * [ ] Refactoriser devisController.js
 * [ ] Refactoriser adminController.js
 * [ ] Ajouter tests unitaires des services
 * [ ] Ajouter tests d'intégration
 */

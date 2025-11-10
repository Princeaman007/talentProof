import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';

/**
 * Middleware pour protéger les routes (vérifier JWT)
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token existe dans le header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé. Token manquant.',
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'entreprise depuis la base de données
    const company = await Company.findById(decoded.id).select('-password');

    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé. Entreprise introuvable.',
      });
    }

    // Vérifier que le compte est confirmé
    if (!company.isConfirmed) {
      return res.status(403).json({
        success: false,
        message: 'Veuillez confirmer votre email avant de continuer.',
      });
    }

    // Ajouter l'entreprise à la requête
    req.company = company;
    next();
  } catch (error) {
    console.error('Erreur middleware auth:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification.',
    });
  }
};
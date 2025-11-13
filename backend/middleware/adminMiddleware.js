import dotenv from 'dotenv';

dotenv.config();

/**
 * ✅ Middleware pour vérifier si l'utilisateur est admin
 * Phase 4 - Utilise le champ "role" avec fallback sur email
 * À utiliser APRÈS le middleware protect
 */
export const adminOnly = (req, res, next) => {
  try {
    // req.company est ajouté par le middleware protect
    if (!req.company) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié',
      });
    }

    // ✅ MÉTHODE 1 (RECOMMANDÉE) - Vérifier le rôle dans la base de données
    if (req.company.role === 'admin') {
      return next();
    }

    // ⚠️ MÉTHODE 2 (FALLBACK) - Support de l'ancienne méthode (email hardcodé)
    // Utile pendant la transition, peut être supprimé après migration complète
    const adminEmails = [
      process.env.ADMIN_EMAIL || 'info@princeaman.dev',
      'tobin0031@gmail.com'
    ];
    
    if (adminEmails.includes(req.company.email)) {
      console.warn('⚠️ Admin détecté via email (ancienne méthode). Pensez à mettre à jour le champ "role" en BDD !');
      return next();
    }

    // Accès refusé
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.',
    });

  } catch (error) {
    console.error('Erreur middleware adminOnly:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};

/**
 * Alternative : Middleware admin avec vérification directe du mot de passe
 * ⚠️ DÉPRÉCIÉ - À éviter, utiliser protect + adminOnly à la place
 * Conservé pour compatibilité avec anciennes routes
 */
export const adminAuth = async (req, res, next) => {
  try {
    const { adminPassword } = req.body;
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe admin requis.',
      });
    }

    if (adminPassword !== correctPassword) {
      return res.status(403).json({
        success: false,
        message: 'Mot de passe admin incorrect.',
      });
    }

    next();
  } catch (error) {
    console.error('Erreur middleware admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification admin.',
    });
  }
};

/**
 * ✅ ALIAS pour compatibilité avec les nouvelles routes Phase 4
 * Permet d'utiliser "isAdmin" comme nom de middleware
 */
export const isAdmin = adminOnly;
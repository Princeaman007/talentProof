import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware pour vérifier si l'utilisateur est admin
 * À utiliser APRÈS le middleware protect
 */
export const adminOnly = (req, res, next) => {
  // Vérifier si l'email de l'entreprise correspond à l'admin
  const adminEmail = process.env.ADMIN_EMAIL || 'info@princeaman.dev';

  if (req.company && req.company.email === adminEmail) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.',
    });
  }
};

/**
 * Alternative : Middleware admin avec vérification directe du token
 * Utile pour les routes admin qui ne nécessitent pas protect
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
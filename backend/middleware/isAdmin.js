// Middleware pour vérifier que l'utilisateur connecté est un admin
export const isAdmin = (req, res, next) => {
  try {
    // req.user est ajouté par le middleware auth
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié',
      });
    }

    // Vérifier le rôle
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Vous devez être administrateur.',
      });
    }

    next();
  } catch (error) {
    console.error('Erreur middleware isAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};
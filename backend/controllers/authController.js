import Company from '../models/Company.js';
import { hashPassword, comparePassword, generateToken, generateRandomToken, hashToken } from '../utils/auth.js';
import { sendEmail } from '../utils/email.js';
import { confirmationEmailTemplate, resetPasswordTemplate } from '../utils/emailTemplates.js';
import { setTokenCookie, clearTokenCookie, setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/cookieConfig.js';

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'une entreprise
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { nom, email, password, nombreEmployes, profilsRecherches } = req.body;

    // Vérifier si l'email existe déjà
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé.',
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Générer un token de confirmation
    const confirmationToken = generateRandomToken();
    const hashedToken = hashToken(confirmationToken);

    // Créer l'entreprise
    const company = await Company.create({
      nom,
      email,
      password: hashedPassword,
      nombreEmployes: nombreEmployes || '1-10',
      profilsRecherches: profilsRecherches || [],
      confirmationToken: hashedToken,
      // ✅ Les nouveaux champs Phase 4 ont des valeurs par défaut dans le modèle
      // role: 'entreprise' (défaut)
      // isActive: true (défaut)
    });

    // Construire le lien de confirmation
    const confirmationLink = `${process.env.CLIENT_URL}/confirm-email/${confirmationToken}`;

    // Envoyer l'email de confirmation
    try {
      await sendEmail({
        to: email,
        subject: 'Confirmez votre inscription sur TalentProof',
        html: confirmationEmailTemplate(nom, confirmationLink),
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // Ne pas bloquer l'inscription si l'email échoue
    }

    res.status(201).json({
      success: true,
      message: 'Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.',
      data: {
        id: company._id,
        nom: company.nom,
        email: company.email,
      },
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/auth/confirm/:token
 * @desc    Confirmer l'email avec le token
 * @access  Public
 */
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token manquant.',
      });
    }

    // Hasher le token reçu pour comparaison
    const hashedToken = hashToken(token);

    // Trouver l'entreprise avec ce token
    const company = await Company.findOne({
      confirmationToken: hashedToken,
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré.',
      });
    }

    // Confirmer le compte
    company.isConfirmed = true;
    company.confirmationToken = null;
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Email confirmé avec succès ! Vous pouvez maintenant vous connecter.',
    });
  } catch (error) {
    console.error('Erreur confirmEmail:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la confirmation.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'une entreprise
 * @access  Public
 * ✅ Phase 4 - Retourne le role et isActive
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'entreprise avec le password
    const company = await Company.findOne({ email }).select('+password');

    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, company.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // Vérifier que le compte est confirmé
    if (!company.isConfirmed) {
      return res.status(403).json({
        success: false,
        message: 'Veuillez confirmer votre email avant de vous connecter.',
      });
    }

    // ✅ NOUVEAU - Phase 4 - Vérifier si le compte est actif
    if (company.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été suspendu. Veuillez contacter l\'administrateur.',
        suspendedAt: company.suspendedAt,
        suspensionReason: company.suspensionReason,
      });
    }

    // ✅ NOUVEAU - Phase 4 - Mettre à jour lastLogin
    company.lastLogin = new Date();
    await company.save();

    // Générer le access token (court lived) et refresh token (long lived)
    const accessExpire = process.env.ACCESS_TOKEN_EXPIRE || '15m';
    const token = generateToken({ id: company._id }, accessExpire);

    // Générer refresh token (random) et stocker le hash en base
    const refreshToken = generateRandomToken();
    const hashedRefresh = hashToken(refreshToken);
    const refreshExpireMs = parseInt(process.env.REFRESH_TOKEN_EXPIRE_MS, 10) || (7 * 24 * 60 * 60 * 1000);
    company.refreshToken = hashedRefresh;
    company.refreshTokenExpires = Date.now() + refreshExpireMs;
    await company.save();

    // Envoyer les deux cookies sécurisés
    setTokenCookie(res, token);
    setRefreshTokenCookie(res, refreshToken);

    // ✅ MODIFIÉ - Phase 4 - Inclure role et isActive
    const companyData = {
      id: company._id,
      nom: company.nom,
      email: company.email,
      logo: company.logo,
      telephone: company.telephone,
      adresse: company.adresse,
      secteurActivite: company.secteurActivite,
      nombreEmployes: company.nombreEmployes,
      profilsRecherches: company.profilsRecherches,
      role: company.role || 'entreprise', // ✅ NOUVEAU
      isActive: company.isActive !== undefined ? company.isActive : true, // ✅ NOUVEAU
      lastLogin: company.lastLogin, // ✅ NOUVEAU (optionnel)
    };

    // Optionnel: inclure le token dans le body pour compatibilité (deprecated)
    const includeTokenInBody = process.env.DEPRECATE_TOKEN_IN_BODY === 'true' ? false : true;

    const responsePayload = {
      success: true,
      message: 'Connexion réussie.',
      data: companyData,
    };
    if (includeTokenInBody) responsePayload.token = token;

    res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Demander un reset de mot de passe
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Trouver l'entreprise
    const company = await Company.findOne({ email });

    if (!company) {
      // Ne pas révéler si l'email existe ou non (sécurité)
      return res.status(200).json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
      });
    }

    // Générer un token de reset
    const resetToken = generateRandomToken();
    const hashedToken = hashToken(resetToken);

    // Sauvegarder le token et la date d'expiration (1 heure)
    company.resetPasswordToken = hashedToken;
    company.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await company.save();

    // Construire le lien de reset
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Envoyer l'email
    try {
      await sendEmail({
        to: email,
        subject: 'Réinitialisation de votre mot de passe TalentProof',
        html: resetPasswordTemplate(company.nom, resetLink),
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // Supprimer le token si l'email échoue
      company.resetPasswordToken = null;
      company.resetPasswordExpires = null;
      await company.save();

      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
    });
  } catch (error) {
    console.error('Erreur changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion - Clear le cookie de token
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    // ✅ SÉCURITÉ - Nettoyer les cookies token + refresh
    clearTokenCookie(res);
    clearRefreshTokenCookie(res);

    // Supprimer le refresh token côté serveur
    try {
      if (req.company) {
        const company = await Company.findById(req.company._id).select('+refreshToken');
        if (company) {
          company.refreshToken = null;
          company.refreshTokenExpires = null;
          await company.save();
        }
      }
    } catch (e) {
      // ignore
    }

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie.',
    });
  } catch (error) {
    console.error('Erreur logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion.',
    });
  }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Réinitialiser le mot de passe avec le token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token manquant.',
      });
    }

    // Hasher le token reçu
    const hashedToken = hashToken(token);

    // Trouver l'entreprise avec ce token et vérifier l'expiration
    const company = await Company.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré.',
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hashPassword(password);

    // Mettre à jour le mot de passe et supprimer le token
    company.password = hashedPassword;
    company.resetPasswordToken = null;
    company.resetPasswordExpires = null;
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    });
  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Obtenir le profil de l'entreprise connectée
 * @access  Private
 * ✅ Phase 4 - Inclut role et isActive
 */
export const getProfile = async (req, res) => {
  try {
    // req.company est ajouté par le middleware protect
    const company = req.company;

    res.status(200).json({
      success: true,
      company: { // ✅ Changé "data" en "company" pour cohérence
        id: company._id,
        nom: company.nom,
        email: company.email,
        logo: company.logo,
        telephone: company.telephone,
        adresse: company.adresse,
        secteurActivite: company.secteurActivite,
        nombreEmployes: company.nombreEmployes,
        profilsRecherches: company.profilsRecherches,
        role: company.role || 'entreprise', // ✅ NOUVEAU
        isActive: company.isActive !== undefined ? company.isActive : true, // ✅ NOUVEAU
        createdAt: company.createdAt,
        lastLogin: company.lastLogin, // ✅ NOUVEAU
      },
    });
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Modifier le profil de l'entreprise
 * @access  Private
 * ✅ Phase 4 - Retourne role et isActive
 */
export const updateProfile = async (req, res) => {
  try {
    const { nom, telephone, adresse, secteurActivite, nombreEmployes, profilsRecherches } = req.body;

    const company = await Company.findById(req.company._id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Entreprise introuvable.',
      });
    }

    // Mettre à jour les champs
    if (nom) company.nom = nom;
    if (telephone !== undefined) company.telephone = telephone;
    if (adresse !== undefined) company.adresse = adresse;
    if (secteurActivite !== undefined) company.secteurActivite = secteurActivite;
    if (nombreEmployes) company.nombreEmployes = nombreEmployes;
    
    // Parser profilsRecherches si c'est une chaîne JSON
    if (profilsRecherches) {
      try {
        company.profilsRecherches = typeof profilsRecherches === 'string' 
          ? JSON.parse(profilsRecherches) 
          : profilsRecherches;
      } catch (e) {
        company.profilsRecherches = profilsRecherches;
      }
    }
    
    // Gérer l'upload du logo
    if (req.file) {
      company.logo = `/uploads/logos/${req.file.filename}`;
    }

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès.',
      data: {
        id: company._id,
        nom: company.nom,
        email: company.email,
        logo: company.logo,
        telephone: company.telephone,
        adresse: company.adresse,
        secteurActivite: company.secteurActivite,
        nombreEmployes: company.nombreEmployes,
        profilsRecherches: company.profilsRecherches,
        role: company.role || 'entreprise',
        isActive: company.isActive !== undefined ? company.isActive : true,
      },
    });
  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Changer le mot de passe (pour utilisateur connecté)
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Récupérer l'entreprise avec le password
    const company = await Company.findById(req.company._id).select('+password');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Entreprise introuvable.',
      });
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await comparePassword(currentPassword, company.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect.',
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);

    // Mettre à jour
    company.password = hashedPassword;
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès.',
    });
  } catch (error) {
    console.error('Erreur changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @route POST /api/auth/refresh
 * @desc Rotate refresh token and issue new access token
 * @access Public (but requires refresh cookie)
 */
export const refreshToken = async (req, res) => {
  try {
    const incoming = req.cookies && req.cookies.refreshToken;
    if (!incoming) {
      return res.status(401).json({ success: false, message: 'Refresh token manquant' });
    }

    const hashed = hashToken(incoming);

    const company = await Company.findOne({ refreshToken: hashed }).select('+refreshToken +refreshTokenExpires');
    if (!company) {
      return res.status(401).json({ success: false, message: 'Refresh token invalide' });
    }

    if (!company.refreshTokenExpires || company.refreshTokenExpires < Date.now()) {
      // Cleanup
      company.refreshToken = null;
      company.refreshTokenExpires = null;
      await company.save();
      clearRefreshTokenCookie(res);
      return res.status(401).json({ success: false, message: 'Refresh token expiré' });
    }

    // Rotation: générer un nouveau refresh token
    const newRefresh = generateRandomToken();
    const newHashed = hashToken(newRefresh);
    const refreshExpireMs = parseInt(process.env.REFRESH_TOKEN_EXPIRE_MS, 10) || (7 * 24 * 60 * 60 * 1000);
    company.refreshToken = newHashed;
    company.refreshTokenExpires = Date.now() + refreshExpireMs;
    await company.save();

    // Générer un nouvel access token
    const accessExpire = process.env.ACCESS_TOKEN_EXPIRE || '15m';
    const newAccessToken = generateToken({ id: company._id }, accessExpire);

    // Set cookies
    setTokenCookie(res, newAccessToken);
    setRefreshTokenCookie(res, newRefresh);

    const companyData = {
      id: company._id,
      nom: company.nom,
      email: company.email,
      role: company.role || 'entreprise',
      isActive: company.isActive !== undefined ? company.isActive : true,
    };

    return res.status(200).json({ success: true, data: companyData });
  } catch (error) {
    console.error('Erreur refreshToken:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors du refresh token' });
  }
};
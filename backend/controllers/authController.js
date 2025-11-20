import Company from '../models/Company.js';
import { hashPassword, comparePassword, generateToken, generateRandomToken, hashToken } from '../utils/Auth.js';
import { sendEmail } from '../utils/emailService.js';
import { confirmationEmailTemplate, resetPasswordTemplate } from '../utils/emailTemplates.professional.js';
import { setTokenCookie, clearTokenCookie, setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/cookieConfig.js';
import AppError, { 
  emailAlreadyExists, 
  invalidCredentials, 
  emailNotConfirmed, 
  accountInactive,
  tokenInvalid,
  notFound,
  validationError,
  internalError
} from '../utils/AppError.js';
import { asyncHandler } from '../utils/errorHandler.js';

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'une entreprise
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { nom, email, password, nombreEmployes, profilsRecherches } = req.body;

  // Vérifier si l'email existe déjà
  const existingCompany = await Company.findOne({ email });
  if (existingCompany) {
    throw emailAlreadyExists();
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
  });

  // Construire le lien de confirmation
  const confirmationLink = `${process.env.CLIENT_URL}/confirm-email/${confirmationToken}`;

  // Envoyer l'email de confirmation
  console.log(' Tentative d\'envoi email de confirmation à:', email);
  console.log(' Lien de confirmation:', confirmationLink);
  
  try {
    const simpleHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2E4A9E;">Bienvenue sur TalentProof</h2>
        <p>Bonjour <strong>${nom}</strong>,</p>
        <p>Merci de vous être inscrit sur TalentProof, la plateforme de recrutement qui connecte les entreprises avec des talents tech validés.</p>
        <p>Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
        <p><a href="${confirmationLink}" style="background: #2E4A9E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirmer mon email</a></p>
        <p>Ou copiez ce lien dans votre navigateur :<br><a href="${confirmationLink}">${confirmationLink}</a></p>
        <p style="color: #666; font-size: 14px;">Ce lien expire dans 24 heures.</p>
        <p>Cordialement,<br><strong>L'équipe TalentProof</strong></p>
      </body>
      </html>
    `;
    
    const simpleText = `
Bienvenue sur TalentProof

Bonjour ${nom},

Merci de vous être inscrit sur TalentProof.

Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur ce lien :
${confirmationLink}

Ce lien expire dans 24 heures.

Cordialement,
L'équipe TalentProof
    `;
    
    const emailResult = await sendEmail({
      to: email,
      subject: 'Confirmez votre inscription sur TalentProof',
      html: simpleHtml,
      text: simpleText,
    });
    console.log(' Email de confirmation envoyé avec succès:', emailResult.messageId);
  } catch (emailError) {
    console.error(' ERREUR CRITIQUE - Envoi email échoué:', {
      error: emailError.message,
      code: emailError.code,
      stack: emailError.stack,
      recipient: email,
    });
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
});

/**
 * @route   GET /api/auth/confirm/:token
 * @desc    Confirmer l'email avec le token
 * @access  Public
 */
export const confirmEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw validationError('Token manquant');
  }

  // Hasher le token reçu pour comparaison
  const hashedToken = hashToken(token);

  // Trouver l'entreprise avec ce token
  const company = await Company.findOne({
    confirmationToken: hashedToken,
  });

  if (!company) {
    throw tokenInvalid('Token de confirmation invalide ou expiré');
  }

  // Confirmer le compte
  company.isConfirmed = true;
  company.confirmationToken = null;
  await company.save();

  res.status(200).json({
    success: true,
    message: 'Email confirmé avec succès ! Vous pouvez maintenant vous connecter.',
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'une entreprise
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Trouver l'entreprise avec le password
  const company = await Company.findOne({ email }).select('+password');

  if (!company) {
    throw invalidCredentials();
  }

  // Vérifier le mot de passe
  const isPasswordValid = await comparePassword(password, company.password);

  if (!isPasswordValid) {
    throw invalidCredentials();
  }

  // Vérifier que le compte est confirmé
  if (!company.isConfirmed) {
    throw emailNotConfirmed();
  }

  // Vérifier si le compte est actif
  if (company.isActive === false) {
    throw accountInactive(company.suspensionReason);
  }

  // Mettre à jour lastLogin
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
    role: company.role || 'entreprise',
    isActive: company.isActive !== undefined ? company.isActive : true,
    lastLogin: company.lastLogin,
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
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Demander un reset de mot de passe
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
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
  company.resetPasswordExpires = Date.now() + 3600000;
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
    company.resetPasswordToken = null;
    company.resetPasswordExpires = null;
    await company.save();
    throw internalError('Erreur lors de l\'envoi de l\'email de réinitialisation');
  }

  res.status(200).json({
    success: true,
    message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion - Clear le cookie de token
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // Nettoyer les cookies token + refresh
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
    // Ignore errors during logout
  }

  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie.',
  });
});

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Réinitialiser le mot de passe avec le token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    throw validationError('Token manquant');
  }

  // Hasher le token reçu
  const hashedToken = hashToken(token);

  // Trouver l'entreprise avec ce token et vérifier l'expiration
  const company = await Company.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!company) {
    throw tokenInvalid('Token de réinitialisation invalide ou expiré');
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
});

/**
 * @route   GET /api/auth/profile
 * @desc    Obtenir le profil de l'entreprise connectée
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  // req.company est ajouté par le middleware protect
  const company = req.company;

  res.status(200).json({
    success: true,
    company: {
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
      createdAt: company.createdAt,
      lastLogin: company.lastLogin,
      },
    });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Modifier le profil de l'entreprise
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { nom, telephone, adresse, secteurActivite, nombreEmployes, profilsRecherches } = req.body;

  const company = await Company.findById(req.company._id);

  if (!company) {
    throw notFound('Entreprise');
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
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Changer le mot de passe (pour utilisateur connecté)
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Récupérer l'entreprise avec le password
  const company = await Company.findById(req.company._id).select('+password');

  if (!company) {
    throw notFound('Entreprise');
  }

  // Vérifier le mot de passe actuel
  const isPasswordValid = await comparePassword(currentPassword, company.password);

  if (!isPasswordValid) {
    throw invalidCredentials('Mot de passe actuel incorrect');
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
});

/**
 * @route POST /api/auth/refresh
 * @desc Rotate refresh token and issue new access token
 * @access Public (but requires refresh cookie)
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies && req.cookies.refreshToken;
  if (!incoming) {
    throw tokenInvalid('Refresh token manquant');
  }

  const hashed = hashToken(incoming);

  const company = await Company.findOne({ refreshToken: hashed }).select('+refreshToken +refreshTokenExpires');
  if (!company) {
    throw tokenInvalid('Refresh token invalide');
  }

  if (!company.refreshTokenExpires || company.refreshTokenExpires < Date.now()) {
    // Cleanup
    company.refreshToken = null;
    company.refreshTokenExpires = null;
    await company.save();
    clearRefreshTokenCookie(res);
    throw tokenInvalid('Refresh token expiré');
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
});
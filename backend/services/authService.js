/**
 * Service d'authentification
 *  Logique métier centralisée
 *  Réutilisable dans les contrôleurs
 *  Séparation concerns
 */
import Company from '../models/Company.js';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateRandomToken,
  hashToken,
} from './Auth.js';
import { sendEmail } from './emailService.js';
import {
  confirmationEmailTemplate,
  resetPasswordTemplate,
} from './emailTemplates.professional.js';
import {
  AuthenticationError,
  ValidationError,
  ConflictError,
  NotFoundError,
} from './errorHandler.js';
import { logger } from './logger.js';

/**
 * Créer un nouvel compte entreprise
 */
export const registerService = async (registerData) => {
  const { nom, email, password, nombreEmployes, profilsRecherches } = registerData;

  // Vérifier si email existe
  const existingCompany = await Company.findOne({ email });
  if (existingCompany) {
    throw new ConflictError('Cet email est déjà utilisé');
  }

  // Hasher password
  const hashedPassword = await hashPassword(password);

  // Générer token de confirmation
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

  logger.info('Company registered', { email, nom });

  // Envoyer email de confirmation
  try {
    const confirmationLink = `${process.env.CLIENT_URL}/confirm-email/${confirmationToken}`;
    await sendEmail({
      to: email,
      subject: 'Confirmez votre inscription sur TalentProof',
      html: confirmationEmailTemplate(nom, confirmationLink),
    });
  } catch (emailError) {
    logger.warn('Registration confirmation email failed', { email });
    // Ne pas bloquer l'inscription
  }

  return {
    id: company._id,
    nom: company.nom,
    email: company.email,
  };
};

/**
 * Confirmer l'email
 */
export const confirmEmailService = async (token) => {
  if (!token) {
    throw new ValidationError('Token manquant');
  }

  const hashedToken = hashToken(token);
  const company = await Company.findOne({
    confirmationToken: hashedToken,
  });

  if (!company) {
    throw new ValidationError('Token invalide ou expiré');
  }

  company.isConfirmed = true;
  company.confirmationToken = null;
  await company.save();

  logger.info('Email confirmed', { email: company.email });

  return company;
};

/**
 * Connexion
 */
export const loginService = async (email, password) => {
  // Trouver l'entreprise
  const company = await Company.findOne({ email }).select('+password');

  if (!company || !(await comparePassword(password, company.password))) {
    throw new AuthenticationError('Email ou mot de passe incorrect');
  }

  // Vérifier email confirmé
  if (!company.isConfirmed) {
    throw new AuthenticationError('Veuillez confirmer votre email');
  }

  // Vérifier compte actif
  if (company.isActive === false) {
    throw new AuthenticationError('Votre compte a été suspendu');
  }

  // Mettre à jour lastLogin
  company.lastLogin = new Date();
  await company.save();

  // Générer token
  const token = generateToken({ id: company._id }, process.env.JWT_EXPIRE || '24h');

  logger.info('Company logged in', { email });

  return {
    token,
    company: {
      id: company._id,
      nom: company.nom,
      email: company.email,
      logo: company.logo,
      nombreEmployes: company.nombreEmployes,
      profilsRecherches: company.profilsRecherches,
      role: company.role || 'entreprise',
      isActive: company.isActive !== undefined ? company.isActive : true,
      lastLogin: company.lastLogin,
    },
  };
};

/**
 * Demander reset password
 */
export const forgotPasswordService = async (email) => {
  const company = await Company.findOne({ email });

  if (!company) {
    // Ne pas révéler si email existe (sécurité)
    return { sent: true };
  }

  // Générer token de reset
  const resetToken = generateRandomToken();
  const hashedToken = hashToken(resetToken);

  company.resetPasswordToken = hashedToken;
  company.resetPasswordExpires = Date.now() + 3600000; // 1 heure
  await company.save();

  // Envoyer email
  try {
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: resetPasswordTemplate(company.nom, resetLink),
    });
    logger.info('Password reset email sent', { email });
  } catch (emailError) {
    logger.error('Password reset email failed', { email });
    // Nettoyer le token
    company.resetPasswordToken = null;
    company.resetPasswordExpires = null;
    await company.save();
    throw emailError;
  }

  return { sent: true };
};

/**
 * Réinitialiser password
 */
export const resetPasswordService = async (token, newPassword) => {
  if (!token) {
    throw new ValidationError('Token manquant');
  }

  const hashedToken = hashToken(token);
  const company = await Company.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!company) {
    throw new ValidationError('Token invalide ou expiré');
  }

  company.password = await hashPassword(newPassword);
  company.resetPasswordToken = null;
  company.resetPasswordExpires = null;
  await company.save();

  logger.info('Password reset', { email: company.email });

  return company;
};

export default {
  registerService,
  confirmEmailService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
};

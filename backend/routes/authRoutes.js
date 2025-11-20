import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  register,
  confirmEmail,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../utils/Validation.js';

const router = express.Router();

// CONFIGURATION MULTER pour upload logo entreprise
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/logos/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accepter uniquement les images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const uploadLogo = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: fileFilter
});

// Routes publiques
router.post('/register', registerValidation, register);
router.get('/confirm/:token', confirmEmail);
router.post('/login', loginValidation, login);
router.post('/forgot-password', (req, res, next) => {
  console.log('🔵 [ROUTE] /forgot-password HIT - Body:', req.body);
  console.log('🔵 [ROUTE] Email from body:', req.body?.email);
  next();
}, forgotPasswordValidation, (req, res, next) => {
  console.log('🟢 [ROUTE] Validation passed, calling controller...');
  next();
}, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

// Refresh token endpoint
router.post('/refresh', refreshToken);

// Routes protégées (nécessitent authentification)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, uploadLogo.single('logo'), updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

export default router;

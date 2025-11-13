import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

// Import controllers
import {
  getEntrepriseDashboardStats,
  getMyContactRequests,
} from '../controllers/entrepriseDashboardController.js';

import {
  addFavori,
  removeFavori,
  getFavoris,
  updateFavoriNote,
  checkIfFavori,
} from '../controllers/favorisController.js';

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from '../controllers/notificationsController.js';

const router = express.Router();

// ========================================
// ROUTES DASHBOARD ENTREPRISE
// ========================================

// @route   GET /api/entreprise/dashboard/stats
// @desc    Obtenir statistiques personnelles entreprise
// @access  Private/Entreprise
router.get('/dashboard/stats', protect, getEntrepriseDashboardStats);

// @route   GET /api/entreprise/contact-requests
// @desc    Obtenir toutes mes demandes de contact
// @access  Private/Entreprise
router.get('/contact-requests', protect, getMyContactRequests);

// ========================================
// ROUTES FAVORIS
// ========================================

// @route   POST /api/entreprise/favoris
// @desc    Ajouter un talent aux favoris
// @access  Private/Entreprise
router.post('/favoris', protect, addFavori);

// @route   GET /api/entreprise/favoris
// @desc    Obtenir tous mes favoris
// @access  Private/Entreprise
router.get('/favoris', protect, getFavoris);

// @route   GET /api/entreprise/favoris/check/:talentId
// @desc    Vérifier si un talent est en favoris
// @access  Private/Entreprise
router.get('/favoris/check/:talentId', protect, checkIfFavori);

// @route   PUT /api/entreprise/favoris/:talentId/note
// @desc    Modifier la note d'un favori
// @access  Private/Entreprise
router.put('/favoris/:talentId/note', protect, updateFavoriNote);

// @route   DELETE /api/entreprise/favoris/:talentId
// @desc    Retirer un talent des favoris
// @access  Private/Entreprise
router.delete('/favoris/:talentId', protect, removeFavori);

// ========================================
// ROUTES NOTIFICATIONS
// ========================================

// @route   GET /api/entreprise/notifications/unread-count
// @desc    Obtenir le nombre de notifications non lues
// @access  Private/Entreprise
router.get('/notifications/unread-count', protect, getUnreadCount);

// @route   GET /api/entreprise/notifications
// @desc    Obtenir mes notifications
// @access  Private/Entreprise
router.get('/notifications', protect, getNotifications);

// @route   PUT /api/entreprise/notifications/read-all
// @desc    Marquer toutes les notifications comme lues
// @access  Private/Entreprise
router.put('/notifications/read-all', protect, markAllAsRead);

// @route   PUT /api/entreprise/notifications/:id/read
// @desc    Marquer une notification comme lue
// @access  Private/Entreprise
router.put('/notifications/:id/read', protect, markAsRead);

// @route   DELETE /api/entreprise/notifications/:id
// @desc    Supprimer une notification
// @access  Private/Entreprise
router.delete('/notifications/:id', protect, deleteNotification);

export default router;
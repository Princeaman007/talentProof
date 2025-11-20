import Notification from '../models/Notification.js';
import AppError, { 
  validationError, 
  emailAlreadyExists,
  notFound,
  internalError,
  unauthorized,
  forbidden
} from '../utils/AppError.js';
import { asyncHandler } from '../utils/errorHandler.js';

// @desc    Obtenir mes notifications
// @route   GET /api/entreprise/notifications
// @access  Private/Entreprise
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = 'false' } = req.query;
  const skip = (page - 1) * limit;

  const filter = { entreprise: req.user._id };

  if (unreadOnly === 'true') {
    filter.isRead = false;
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({
    entreprise: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    notifications,
    unreadCount,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    },
  });
});

// @desc    Marquer une notification comme lue
// @route   PUT /api/entreprise/notifications/:id/read
// @access  Private/Entreprise
export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOne({
    _id: id,
    entreprise: req.user._id,
  });

  if (!notification) {
    throw notFound('Notification');
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marquée comme lue',
    notification,
  });
});

// @desc    Marquer toutes les notifications comme lues
// @route   PUT /api/entreprise/notifications/read-all
// @access  Private/Entreprise
export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    {
      entreprise: req.user._id,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} notification(s) marquée(s) comme lue(s)`,
    modifiedCount: result.modifiedCount,
  });
});

// @desc    Supprimer une notification
// @route   DELETE /api/entreprise/notifications/:id
// @access  Private/Entreprise
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndDelete({
    _id: id,
    entreprise: req.user._id,
  });

  if (!notification) {
    throw notFound('Notification');
  }

  res.status(200).json({
    success: true,
    message: 'Notification supprimée',
  });
});

// @desc    Obtenir le nombre de notifications non lues
// @route   GET /api/entreprise/notifications/unread-count
// @access  Private/Entreprise
export const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({
    entreprise: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    unreadCount,
  });
});
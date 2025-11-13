import Notification from '../models/Notification.js';

// @desc    Obtenir mes notifications
// @route   GET /api/entreprise/notifications
// @access  Private/Entreprise
export const getNotifications = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Erreur getNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications',
      error: error.message,
    });
  }
};

// @desc    Marquer une notification comme lue
// @route   PUT /api/entreprise/notifications/:id/read
// @access  Private/Entreprise
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      entreprise: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée',
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marquée comme lue',
      notification,
    });
  } catch (error) {
    console.error('Erreur markAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    });
  }
};

// @desc    Marquer toutes les notifications comme lues
// @route   PUT /api/entreprise/notifications/read-all
// @access  Private/Entreprise
export const markAllAsRead = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Erreur markAllAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    });
  }
};

// @desc    Supprimer une notification
// @route   DELETE /api/entreprise/notifications/:id
// @access  Private/Entreprise
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      entreprise: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification supprimée',
    });
  } catch (error) {
    console.error('Erreur deleteNotification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message,
    });
  }
};

// @desc    Obtenir le nombre de notifications non lues
// @route   GET /api/entreprise/notifications/unread-count
// @access  Private/Entreprise
export const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      entreprise: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error('Erreur getUnreadCount:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage',
      error: error.message,
    });
  }
};
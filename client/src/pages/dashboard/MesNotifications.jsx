import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
  FaBell,
  FaSpinner,
  FaCheckCircle,
  FaTrash,
  FaEnvelope,
  FaUsers,
  FaFileInvoice,
  FaCog,
} from 'react-icons/fa';

const MesNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [unreadOnly]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/entreprise/notifications', {
        params: {
          unreadOnly: unreadOnly.toString(),
          limit: 20,
        },
      });

      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/entreprise/notifications/${notificationId}/read`);
      
      // Mettre à jour localement
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/entreprise/notifications/read-all');
      
      // Mettre à jour localement
      setNotifications(
        notifications.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur marquage toutes notifications:', error);
      alert('Erreur lors du marquage');
    }
  };

  const handleDelete = async (notificationId) => {
    if (!confirm('Supprimer cette notification ?')) return;

    try {
      await api.delete(`/entreprise/notifications/${notificationId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      
      // Décrémenter unreadCount si c'était non lu
      const notification = notifications.find((n) => n._id === notificationId);
      if (!notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur suppression notification:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'nouveau_talent':
        return <FaUsers className="text-blue-600" />;
      case 'demande_traitee':
        return <FaCheckCircle className="text-green-600" />;
      case 'devis_repondu':
        return <FaFileInvoice className="text-orange-600" />;
      default:
        return <FaCog className="text-gray-600" />;
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return notifDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <FaBell className="text-accent mr-3" />
            Mes Notifications
          </h1>
          <p className="text-neutral mt-2">
            {unreadCount > 0
              ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Aucune nouvelle notification'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn-secondary text-sm"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Notifications</p>
              <p className="text-3xl font-bold mt-1">{notifications.length}</p>
            </div>
            <FaBell className="text-5xl opacity-20" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-400 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Non lues</p>
              <p className="text-3xl font-bold mt-1">{unreadCount}</p>
            </div>
            <FaEnvelope className="text-5xl opacity-20" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <p className="font-semibold text-neutral">Afficher :</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setUnreadOnly(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                !unreadOnly
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-neutral hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setUnreadOnly(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                unreadOnly
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-neutral hover:bg-gray-200'
              }`}
            >
              Non lues seulement
            </button>
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      {notifications.length === 0 ? (
        <div className="card text-center py-12">
          <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral mb-2">
            {unreadOnly ? 'Aucune notification non lue' : 'Aucune notification'}
          </h3>
          <p className="text-neutral">
            {unreadOnly
              ? 'Toutes vos notifications ont été lues'
              : 'Vous recevrez des notifications ici lors de nouvelles activités'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`card hover:shadow-lg transition cursor-pointer ${
                !notification.isRead
                  ? 'border-l-4 border-l-accent bg-blue-50'
                  : 'bg-white'
              }`}
              onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3
                      className={`font-semibold ${
                        !notification.isRead ? 'text-primary' : 'text-neutral-dark'
                      }`}
                    >
                      {notification.titre}
                    </h3>
                    <span className="text-xs text-neutral whitespace-nowrap ml-2">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral mb-2">
                    {notification.message}
                  </p>

                  {notification.lien && (
                    <Link
                      to={notification.lien}
                      className="text-sm text-primary hover:text-primary-dark font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Voir plus →
                    </Link>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification._id);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Marquer comme lu"
                    >
                      <FaCheckCircle />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification._id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h3 className="font-semibold text-primary mb-2">
              Types de notifications
            </h3>
            <ul className="text-neutral text-sm space-y-1">
              <li>• <strong>Nouveau talent</strong> : Un nouveau talent correspondant à vos critères a été ajouté</li>
              <li>• <strong>Demande traitée</strong> : Votre demande de contact a été traitée par TalentProof</li>
              <li>• <strong>Devis répondu</strong> : Vous avez reçu une réponse à votre demande de devis</li>
              <li>• <strong>Système</strong> : Notifications importantes sur votre compte</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesNotifications;
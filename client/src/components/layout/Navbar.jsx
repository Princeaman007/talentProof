import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaCheckCircle, FaSignInAlt, FaUserPlus, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  // ✅ NOUVEAU - Récupérer le nombre de notifications non lues
  useEffect(() => {
    if (user && !isAdmin) {
      fetchUnreadCount();
      
      // Actualiser toutes les 30 secondes
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, isAdmin]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/entreprise/notifications/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      // Silencieux - pas grave si ça échoue
      console.error('Erreur récupération notifications:', error);
    }
  };

  // Navigation links - conditionnels selon l'état de connexion
  const navLinks = user ? [
    { name: 'Accueil', path: '/' },
    { name: 'Talents', path: '/dashboard/talents' },
    { name: 'Services', path: '/services' },
    { name: 'À propos', path: '/about' },
  ] : [
    { name: 'Accueil', path: '/' },
    { name: 'Talents', path: '/talents' },
    { name: 'Services', path: '/services' },
    { name: 'À propos', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-lg group-hover:scale-110 transition-transform">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TalentProof
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold transition-all duration-300 relative ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-neutral hover:text-primary'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-secondary rounded-full"></span>
                )}
              </Link>
            ))}
            
            {/* Si l'utilisateur est connecté */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* ✅ NOUVEAU - Badge Notifications (seulement pour entreprises, pas admin) */}
                {!isAdmin && (
                  <Link
                    to="/dashboard/notifications"
                    className="relative p-2 text-neutral hover:text-primary transition-all"
                    title="Notifications"
                  >
                    <FaBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )}
                
                <Link
                  to="/dashboard"
                  className="btn-primary"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              // Si l'utilisateur n'est PAS connecté
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 font-semibold text-neutral hover:text-primary transition-all"
                >
                  <FaSignInAlt />
                  <span>Connexion</span>
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  <FaUserPlus className="inline mr-2" />
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary text-2xl focus:outline-none"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-4 rounded-lg font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-primary text-white'
                    : 'text-neutral hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile - Si connecté */}
            {user ? (
              <>
                {/* ✅ NOUVEAU - Notifications mobile (seulement pour entreprises) */}
                {!isAdmin && (
                  <Link
                    to="/dashboard/notifications"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-2 px-4 rounded-lg font-semibold text-neutral hover:bg-gray-100"
                  >
                    <span className="flex items-center">
                      <FaBell className="mr-2" />
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )}
                
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-center btn-primary"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              // Mobile - Si non connecté
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-2 px-4 rounded-lg font-semibold text-neutral hover:bg-gray-100"
                >
                  <FaSignInAlt className="inline mr-2" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center btn-primary"
                >
                  <FaUserPlus className="inline mr-2" />
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
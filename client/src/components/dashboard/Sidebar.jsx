import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaUser,
  FaKey,
  FaUsers,
  FaUserTie,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaFolder,
  FaFileInvoice,
  FaChartLine,
  FaBuilding,
  FaEnvelope,
  FaStar,
  FaBell,
  FaHistory,
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      name: 'Accueil',
      path: '/dashboard',
      icon: FaHome,
      admin: false,
    },
    {
      name: 'Consulter Talents',
      path: '/dashboard/talents',
      icon: FaUsers,
      admin: false,
    },
    {
      name: 'Mon Profil',
      path: '/dashboard/profile',
      icon: FaUser,
      admin: false,
    },
    {
      name: 'Mot de passe',
      path: '/dashboard/change-password',
      icon: FaKey,
      admin: false,
    },
  ];

  // ✅ NOUVEAU - Menu entreprise (Phase 4)
  const entrepriseMenuItems = [
    {
      name: 'Mes Favoris',
      path: '/dashboard/mes-favoris',
      icon: FaStar,
      admin: false,
    },
    {
      name: 'Mes Demandes',
      path: '/dashboard/mes-demandes',
      icon: FaHistory,
      admin: false,
    },
    {
      name: 'Notifications',
      path: '/dashboard/notifications',
      icon: FaBell,
      admin: false,
    },
  ];

  // ✅ MODIFIÉ - Menu admin avec nouvelles entrées Phase 4
  const adminMenuItems = [
    {
      name: 'Statistiques',
      path: '/dashboard/admin/stats',
      icon: FaChartLine,
      admin: true,
    },
    {
      name: 'Entreprises',
      path: '/dashboard/admin/entreprises',
      icon: FaBuilding,
      admin: true,
    },
    {
      name: 'Demandes Contact',
      path: '/dashboard/admin/contact-requests',
      icon: FaEnvelope,
      admin: true,
    },
    {
      name: 'Gérer Talents',
      path: '/dashboard/admin/talents',
      icon: FaUsers,
      admin: true,
    },
    {
      name: 'Gérer Équipe',
      path: '/dashboard/admin/team',
      icon: FaUserTie,
      admin: true,
    },
    {
      name: 'Portfolio',
      path: '/dashboard/admin/portfolio',
      icon: FaFolder,
      admin: true,
    },
    {
      name: 'Demandes de Devis',
      path: '/dashboard/admin/devis',
      icon: FaFileInvoice,
      admin: true,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-24 left-4 z-50 p-3 bg-primary text-white rounded-lg shadow-lg"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-xl z-40
          w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 flex flex-col
        `}
      >
        {/* User Info */}
        <div className="p-6 bg-gradient-to-r from-primary to-primary-dark text-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <FaUser size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.nom}</p>
              <p className="text-xs opacity-90">
                {isAdmin ? 'Administrateur' : 'Entreprise'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - avec scroll */}
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Menu Principal */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* ✅ NOUVEAU - Menu Entreprise (Phase 4) */}
          {!isAdmin && (
            <>
              <div className="my-4">
                <div className="border-t border-gray-200" />
              </div>
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">
                  Mes outils
                </p>
              </div>
              <div className="space-y-1">
                {entrepriseMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${
                        isActive(item.path)
                          ? 'bg-accent text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon size={18} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Menu Admin */}
          {isAdmin && (
            <>
              <div className="my-4">
                <div className="border-t border-gray-200" />
              </div>
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">
                  Administration
                </p>
              </div>
              <div className="space-y-1">
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${
                        isActive(item.path)
                          ? 'bg-secondary text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon size={18} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Logout Button - Toujours visible en bas */}
        <div className="p-4 border-t border-gray-200 shrink-0 bg-white">
          <button
            onClick={handleLogout}
            className="
              flex items-center justify-center space-x-3 w-full px-4 py-3 rounded-lg
              text-white bg-red-600 hover:bg-red-700 transition-all duration-200
              font-medium shadow-md hover:shadow-lg
            "
          >
            <FaSignOutAlt size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaUser, 
  FaLock, 
  FaUsers, 
  FaUserShield, 
  FaSignOutAlt,
  FaBars,
  FaTimes 
} from 'react-icons/fa';
import { useState } from 'react';

// Pages Dashboard
import DashboardHome from './dashboard/DashboardHome';
import Profile from './dashboard/Profile';
import ChangePassword from './dashboard/ChangePassword';
import AdminTalents from './dashboard/AdminTalents';
import AdminTeam from './dashboard/AdminTeam';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Accueil', path: '/dashboard', icon: <FaHome />, adminOnly: false },
    { name: 'Mon Profil', path: '/dashboard/profile', icon: <FaUser />, adminOnly: false },
    { name: 'Mot de passe', path: '/dashboard/change-password', icon: <FaLock />, adminOnly: false },
  ];

  const adminMenuItems = [
    { name: 'Gestion Talents', path: '/dashboard/admin/talents', icon: <FaUsers />, adminOnly: true },
    { name: 'Gestion Équipe', path: '/dashboard/admin/team', icon: <FaUserShield />, adminOnly: true },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-50 bg-primary text-white p-3 rounded-lg shadow-lg"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <aside
          className={`
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-40 transform transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.nom?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-dark truncate">{user?.nom}</p>
                <p className="text-sm text-neutral truncate">{user?.email}</p>
              </div>
            </div>
            {isAdmin && (
              <div className="mt-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-accent text-white">
                  <FaUserShield className="mr-1" /> Admin
                </span>
              </div>
            )}
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-neutral hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-neutral uppercase tracking-wider">
                    Administration
                  </p>
                </div>
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                      ${
                        isActive(item.path)
                          ? 'bg-secondary text-white'
                          : 'text-neutral hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-4"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <main className="flex-1 p-4 lg:p-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
            {isAdmin && (
              <>
                <Route path="admin/talents" element={<AdminTalents />} />
                <Route path="admin/team" element={<AdminTeam />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
};
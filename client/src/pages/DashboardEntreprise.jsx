import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import { useState, useEffect } from 'react';

// Pages Dashboard existantes
import DashboardHome from './dashboard/Dashboardhome';
import Profile from './dashboard/Profile';
import ChangePassword from './dashboard/ChangePassword';
import TalentsDashboard from './dashboard/TalentsDashboard'; 

// Pages Admin existantes
import AdminTalents from './dashboard/AdminTalents';
import AdminTeam from './dashboard/AdminTeam';
import AdminDevis from './dashboard/AdminDevis';  
import AdminPortfolio from './dashboard/AdminPortfolio';
import AdminTalentDays from './dashboard/AdminTalentDays';

//  NOUVELLES PAGES - PHASE 4 ADMIN
import AdminStats from './dashboard/Adminstats';
import AdminEntreprises from './dashboard/Adminentreprises';
import AdminContactRequests from './dashboard/Admincontactrequests';
import AdminCompanies from './dashboard/AdminCompanies';

//  NOUVELLES PAGES - PHASE 4 ENTREPRISE
import MesFavoris from './dashboard/MesFavoris';
import MesDemandesContact from './dashboard/MesDemandesContact';
import MesNotifications from './dashboard/MesNotifications';

const DashboardEntreprise = () => {
  const { isAdmin, user } = useAuth();
  
  // ✅ Écouter les changements de largeur de la sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      setSidebarCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement les changements (pour le même onglet)
    const interval = setInterval(handleStorageChange, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  console.log('🏢 [DASHBOARD ENTREPRISE] Rendering:', {
    isAdmin,
    userEmail: user?.email,
    userRole: user?.role,
    sidebarCollapsed
  });

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content - S'adapte à la largeur de la sidebar */}
        <div 
          className={`
            flex-1 transition-all duration-300
            ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
          `}
        >
          <div className="p-6 lg:p-8">
            <Routes>
              {/* Route principale - Page d'accueil du dashboard */}
              <Route index element={<DashboardHome />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Routes communes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/talents" element={<TalentsDashboard />} />
              
              {/*  NOUVELLES ROUTES ENTREPRISE - PHASE 4 */}
              <Route path="/mes-favoris" element={<MesFavoris />} />
              <Route path="/mes-demandes" element={<MesDemandesContact />} />
              <Route path="/notifications" element={<MesNotifications />} />
              
              {/* Routes Admin */}
              {isAdmin && (
                <>
                  {/*  NOUVELLES ROUTES ADMIN - PHASE 4 */}
                  <Route path="/admin/stats" element={<AdminStats />} />
                  <Route path="/admin/entreprises" element={<AdminEntreprises />} />
                  <Route path="/admin/contact-requests" element={<AdminContactRequests />} />
                  <Route path="/admin/companies" element={<AdminCompanies />} />
                  
                  {/* Routes admin existantes */}
                  <Route path="/admin/talents" element={<AdminTalents />} />
                  <Route path="/admin/team" element={<AdminTeam />} />
                  <Route path="/admin/devis" element={<AdminDevis />} />
                  <Route path="/admin/portfolio" element={<AdminPortfolio />} />
                  <Route path="/admin/talent-days" element={<AdminTalentDays />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEntreprise;
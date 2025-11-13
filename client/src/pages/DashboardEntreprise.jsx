import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';

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

// ✅ NOUVELLES PAGES - PHASE 4 ADMIN
import AdminStats from './dashboard/AdminStats';
import AdminEntreprises from './dashboard/AdminEntreprises';
import AdminContactRequests from './dashboard/AdminContactRequests';

// ✅ NOUVELLES PAGES - PHASE 4 ENTREPRISE
import MesFavoris from './dashboard/MesFavoris';
import MesDemandesContact from './dashboard/MesDemandesContact';
import MesNotifications from './dashboard/MesNotifications';

const DashboardEntreprise = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-6 lg:p-8">
            <Routes>
              {/* Route principale */}
              <Route path="/" element={<DashboardHome />} />
              
              {/* Routes communes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/talents" element={<TalentsDashboard />} />
              
              {/* ✅ NOUVELLES ROUTES ENTREPRISE - PHASE 4 */}
              <Route path="/mes-favoris" element={<MesFavoris />} />
              <Route path="/mes-demandes" element={<MesDemandesContact />} />
              <Route path="/notifications" element={<MesNotifications />} />
              
              {/* Routes Admin */}
              {isAdmin && (
                <>
                  {/* ✅ NOUVELLES ROUTES ADMIN - PHASE 4 */}
                  <Route path="/admin/stats" element={<AdminStats />} />
                  <Route path="/admin/entreprises" element={<AdminEntreprises />} />
                  <Route path="/admin/contact-requests" element={<AdminContactRequests />} />
                  
                  {/* Routes admin existantes */}
                  <Route path="/admin/talents" element={<AdminTalents />} />
                  <Route path="/admin/team" element={<AdminTeam />} />
                  <Route path="/admin/devis" element={<AdminDevis />} />
                  <Route path="/admin/portfolio" element={<AdminPortfolio />} />
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
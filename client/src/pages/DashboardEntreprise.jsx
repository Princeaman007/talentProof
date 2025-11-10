import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';

// Pages Dashboard
import DashboardHome from './dashboard/Dashboardhome';
import Profile from './dashboard/Profile';
import ChangePassword from './dashboard/ChangePassword';
import TalentsDashboard from './dashboard/TalentsDashboard'; // NOUVEAU
import AdminTalents from './dashboard/AdminTalents';
import AdminTeam from './dashboard/AdminTeam';

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
              <Route path="/" element={<DashboardHome />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/talents" element={<TalentsDashboard />} /> {/* NOUVEAU */}
              
              {/* Routes Admin */}
              {isAdmin && (
                <>
                  <Route path="/admin/talents" element={<AdminTalents />} />
                  <Route path="/admin/team" element={<AdminTeam />} />
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
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages publiques
import Home from './pages/Home';
import Talents from './pages/Talents';
import ServicesPage from './pages/ServicesPage';
import About from './pages/About';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Contact from './pages/Contact';
import TalentDays from './pages/Talentdays';
import TalentDayDetail from './pages/Talentdaydetail';
import TalentDayRegister from './pages/Talentdayregister';
import CompanyRegistration from './pages/CompanyRegistration';

// Pages services
import DevisForm from './pages/services/DevisForm';

// Pages auth
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import EmailConfirmation from './pages/auth/EmailConfirmation';
import ConfirmEmail from './pages/auth/ConfirmEmail';

// Pages protégées
import Dashboard from './pages/DashboardEntreprise';

// Composant pour afficher le Footer conditionnellement
const ConditionalFooter = () => {
  const location = useLocation();

  // Ne pas afficher le footer sur les pages dashboard
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  return <Footer />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/talents" element={<Talents />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/talent-days" element={<TalentDays />} />
              <Route path="/talent-days/:id" element={<TalentDayDetail />} />
              <Route path="/talent-days/:id/register" element={<TalentDayRegister />} />
              <Route path="/company-registration" element={<CompanyRegistration />} />

              {/* Routes services */}
              <Route path="/services/devis" element={<DevisForm />} />

              {/* Routes auth */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              <Route path="/confirm-email/:token" element={<ConfirmEmail />} />

              {/* Routes protégées */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          {/* Footer conditionnel : seulement sur les pages NON-dashboard */}
          <ConditionalFooter />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
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

// Pages services
import DevisForm from './pages/services/DevisForm';

// Pages auth
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import EmailConfirmation from './pages/auth/EmailConfirmation';

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

              {/* Routes services */}
              <Route path="/services/devis" element={<DevisForm />} />

              {/* Routes auth */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />

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
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  console.log('️ ProtectedRoute check:', {
    isAuthenticated,
    isAdmin,
    loading,
    token: localStorage.getItem('token') ? 'EXISTS' : 'MISSING',
    user: localStorage.getItem('user') ? 'EXISTS' : 'MISSING'
  });

  if (loading) {
    console.log(' Auth loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.warn(' Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    console.warn('️ Not admin, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log(' Access granted');
  return children;
}
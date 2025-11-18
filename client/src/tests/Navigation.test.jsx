/**
 * Tests pour la navigation et AuthContext
 * Couvre: Routes protégées, redirections, gestion session
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Composant de test pour vérifier l'authentification
const ProtectedPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Accès refusé</div>;
  }
  
  return (
    <div>
      <h1>Page Protégée</h1>
      <p>Bienvenue {user?.nom}</p>
    </div>
  );
};

const PublicPage = () => {
  return <div>Page Publique</div>;
};

describe('Navigation & Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('should show public page without authentication', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/page publique/i)).toBeInTheDocument();
  });

  test('should deny access to protected page without auth', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/protected" element={<ProtectedPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/accès refusé/i)).toBeInTheDocument();
  });

  test('should allow access to protected page with valid token', async () => {
    // Simuler un utilisateur connecté
    const mockUser = {
      nom: 'TechCorp',
      email: 'test@techcorp.com',
      role: 'entreprise'
    };
    
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/protected" element={<ProtectedPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/page protégée/i)).toBeInTheDocument();
      expect(screen.getByText(/bienvenue techcorp/i)).toBeInTheDocument();
    });
  });

  test('should clear authentication on logout', async () => {
    const mockUser = {
      nom: 'TechCorp',
      email: 'test@techcorp.com',
      role: 'entreprise'
    };
    
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const LogoutButton = () => {
      const { logout } = useAuth();
      return <button onClick={logout}>Se déconnecter</button>;
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <LogoutButton />
        </AuthProvider>
      </BrowserRouter>
    );

    const logoutButton = screen.getByText(/se déconnecter/i);
    logoutButton.click();

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  test('should persist user session across page reloads', () => {
    const mockUser = {
      nom: 'TechCorp',
      email: 'test@techcorp.com',
      role: 'entreprise'
    };
    
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    const UserDisplay = () => {
      const { user } = useAuth();
      return user ? <div>Utilisateur: {user.nom}</div> : <div>Non connecté</div>;
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <UserDisplay />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/utilisateur: techcorp/i)).toBeInTheDocument();
  });

  test('should detect admin role correctly', () => {
    const mockAdmin = {
      nom: 'Admin',
      email: 'admin@talentproof.com',
      role: 'admin'
    };
    
    localStorage.setItem('token', 'fake-admin-token');
    localStorage.setItem('user', JSON.stringify(mockAdmin));

    const AdminCheck = () => {
      const { user, isAdmin } = useAuth();
      return (
        <div>
          <p>Role: {user?.role}</p>
          <p>Is Admin: {isAdmin ? 'Oui' : 'Non'}</p>
        </div>
      );
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminCheck />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/role: admin/i)).toBeInTheDocument();
    expect(screen.getByText(/is admin: oui/i)).toBeInTheDocument();
  });

  test('should handle missing user data gracefully', () => {
    localStorage.setItem('token', 'orphan-token');
    // Pas de user dans localStorage

    const UserDisplay = () => {
      const { user, isAuthenticated } = useAuth();
      return (
        <div>
          <p>Authenticated: {isAuthenticated ? 'Oui' : 'Non'}</p>
          <p>User: {user ? user.nom : 'Aucun'}</p>
        </div>
      );
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <UserDisplay />
        </AuthProvider>
      </BrowserRouter>
    );

    // Devrait gérer le cas sans planter
    expect(screen.getByText(/user: aucun/i)).toBeInTheDocument();
  });
});

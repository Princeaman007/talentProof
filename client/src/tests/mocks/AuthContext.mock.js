/**
 * Mock complet pour AuthContext
 * Fournit toutes les méthodes et états nécessaires aux tests
 */

import { vi } from 'vitest';

export const mockUser = {
  nom: 'TechCorp',
  email: 'test@techcorp.com',
  role: 'entreprise',
  id: '123456789'
};

export const mockAdminUser = {
  nom: 'Admin',
  email: 'admin@talentproof.com',
  role: 'admin',
  id: 'admin123'
};

export const mockTalentUser = {
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@example.com',
  role: 'talent',
  id: 'talent123'
};

export const createMockAuthContext = (overrides = {}) => ({
  user: mockUser,
  isAuthenticated: true,
  isAdmin: false,
  loading: false,
  login: vi.fn().mockResolvedValue({ success: true }),
  logout: vi.fn().mockResolvedValue(undefined),
  register: vi.fn().mockResolvedValue({ success: true }),
  updateUser: vi.fn().mockResolvedValue({ success: true }),
  checkAuth: vi.fn().mockResolvedValue(true),
  ...overrides
});

export const unauthenticatedContext = createMockAuthContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false
});

export const adminContext = createMockAuthContext({
  user: mockAdminUser,
  isAuthenticated: true,
  isAdmin: true
});

export const talentContext = createMockAuthContext({
  user: mockTalentUser,
  isAuthenticated: true,
  isAdmin: false
});

// Mock du module AuthContext complet
export const mockAuthContextModule = {
  AuthProvider: ({ children }) => children,
  useAuth: () => createMockAuthContext(),
  AuthContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) => children(createMockAuthContext())
  }
};

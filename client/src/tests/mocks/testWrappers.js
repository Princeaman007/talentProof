/**
 * Wrappers de test réutilisables
 * Fournit des helpers pour render avec tous les providers nécessaires
 */

import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { createMockAuthContext } from './AuthContext.mock';

/**
 * Wrapper avec BrowserRouter uniquement
 */
export const BrowserRouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

/**
 * Wrapper avec MemoryRouter (meilleur pour les tests)
 * @param {string} initialEntries - Routes initiales
 */
export const createMemoryRouterWrapper = (initialEntries = ['/']) => {
  return ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  );
};

/**
 * Mock AuthProvider pour les tests
 */
export const MockAuthProvider = ({ children, value }) => {
  // Stocke le contexte dans un provider fake
  const AuthContext = {
    Provider: ({ children: providerChildren }) => providerChildren
  };
  
  return <AuthContext.Provider value={value || createMockAuthContext()}>
    {children}
  </AuthContext.Provider>;
};

/**
 * Wrapper complet avec Router + AuthProvider
 */
export const createTestWrapper = (options = {}) => {
  const {
    initialEntries = ['/'],
    authContext = createMockAuthContext(),
    useMemoryRouter = true
  } = options;

  const RouterComponent = useMemoryRouter ? MemoryRouter : BrowserRouter;
  const routerProps = useMemoryRouter ? { initialEntries } : {};

  return ({ children }) => (
    <RouterComponent {...routerProps}>
      <MockAuthProvider value={authContext}>
        {children}
      </MockAuthProvider>
    </RouterComponent>
  );
};

/**
 * Custom render avec tous les wrappers
 */
export const renderWithProviders = (ui, options = {}) => {
  const Wrapper = createTestWrapper(options);
  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Helper pour attendre que les promises se résolvent
 */
export const waitForPromises = () => 
  new Promise(resolve => setTimeout(resolve, 0));

/**
 * Helper pour simuler un délai
 */
export const delay = (ms = 100) => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock complet pour axios et l'API
 * Couvre toutes les routes testées
 */

import { vi } from 'vitest';

// Réponses mockées pour chaque endpoint
export const mockResponses = {
  // Auth
  login: {
    data: {
      success: true,
      message: 'Connexion réussie',
      user: {
        nom: 'TechCorp',
        email: 'test@techcorp.com',
        role: 'entreprise'
      },
      token: 'mock-jwt-token'
    }
  },
  
  loginError: {
    response: {
      status: 401,
      data: {
        success: false,
        message: 'Email ou mot de passe incorrect'
      }
    }
  },

  // CSRF Token
  csrfToken: {
    data: {
      csrfToken: 'mock-csrf-token-12345'
    }
  },

  // Contact
  contact: {
    data: {
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
    }
  },

  contactError: {
    response: {
      status: 400,
      data: {
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires'
      }
    }
  },

  // Company Registration
  companyRegister: {
    data: {
      success: true,
      message: 'Inscription enregistrée avec succès. Vous recevrez un email de confirmation.',
      data: {
        _id: '123456',
        companyName: 'TechCorp',
        email: 'test@techcorp.com'
      }
    }
  },

  // TalentDays
  talentDays: {
    data: [
      {
        _id: 'td1',
        titre: 'Hackathon Full-Stack',
        description: 'Événement de développement',
        date: '2025-12-01',
        placesDisponibles: 50,
        technologies: ['React', 'Node.js']
      },
      {
        _id: 'td2',
        titre: 'Workshop React Advanced',
        description: 'Formation avancée React',
        date: '2025-12-15',
        placesDisponibles: 30,
        technologies: ['React', 'TypeScript']
      }
    ]
  },

  // Validation Errors
  validationError: {
    response: {
      status: 400,
      data: {
        success: false,
        message: 'Erreur de validation',
        errors: [
          { field: 'email', message: 'Email invalide' }
        ]
      }
    }
  }
};

// Mock axios complet
export const createMockAxios = () => ({
  get: vi.fn((url) => {
    if (url.includes('/csrf-token')) {
      return Promise.resolve(mockResponses.csrfToken);
    }
    if (url.includes('/talent-days')) {
      return Promise.resolve(mockResponses.talentDays);
    }
    return Promise.resolve({ data: {} });
  }),

  post: vi.fn((url, data) => {
    if (url.includes('/auth/login')) {
      if (data.email === 'invalid@test.com') {
        return Promise.reject(mockResponses.loginError);
      }
      return Promise.resolve(mockResponses.login);
    }
    if (url.includes('/contact')) {
      if (!data.nom || !data.email) {
        return Promise.reject(mockResponses.contactError);
      }
      return Promise.resolve(mockResponses.contact);
    }
    if (url.includes('/companies')) {
      return Promise.resolve(mockResponses.companyRegister);
    }
    return Promise.resolve({ data: { success: true } });
  }),

  put: vi.fn(() => Promise.resolve({ data: { success: true } })),
  delete: vi.fn(() => Promise.resolve({ data: { success: true } })),
  patch: vi.fn(() => Promise.resolve({ data: { success: true } })),

  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn()
    },
    response: {
      use: vi.fn(),
      eject: vi.fn()
    }
  },

  defaults: {
    headers: {
      common: {},
      get: {},
      post: {},
      put: {},
      delete: {},
      patch: {}
    }
  }
});

// Mock de l'API instance
export const mockApi = createMockAxios();

// Mock du module axios par défaut
export const mockAxiosModule = {
  default: mockApi,
  create: vi.fn(() => mockApi),
  ...mockApi
};

// Helper pour reset tous les mocks
export const resetApiMocks = () => {
  mockApi.get.mockClear();
  mockApi.post.mockClear();
  mockApi.put.mockClear();
  mockApi.delete.mockClear();
  mockApi.patch.mockClear();
};

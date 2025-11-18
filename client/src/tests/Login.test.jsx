/**
 * Tests pour le formulaire de login
 * Couvre: Validation, authentification, gestion erreurs
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/auth/Login';
import { AuthProvider } from '../context/AuthContext';
import api from '../../utils/api';

// Mock du module api
vi.mock('../../utils/api', () => ({
  default: {
    post: vi.fn(),
  }
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render login form', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    expect(screen.getByText(/mot de passe oublié/i)).toBeInTheDocument();
  });

  test('should show validation error for empty email', async () => {
    renderWithRouter(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email est requis/i)).toBeInTheDocument();
    });
  });

  test('should show validation error for invalid email format', async () => {
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    });
  });

  test('should show validation error for empty password', async () => {
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/mot de passe est requis/i)).toBeInTheDocument();
    });
  });

  test('should login successfully with valid credentials', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        success: true,
        token: 'fake-jwt-token',
        data: {
          nom: 'Test Company',
          email: 'test@example.com',
          role: 'entreprise'
        }
      }
    });

    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Password123!'
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('should show error message for invalid credentials', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: { message: 'Email ou mot de passe incorrect' }
      }
    });

    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'wrong@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { 
      target: { value: 'wrongpassword' } 
    });

    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email ou mot de passe incorrect/i)).toBeInTheDocument();
    });
  });

  test('should toggle password visibility', () => {
    renderWithRouter(<Login />);
    
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const toggleButton = screen.getByRole('button', { name: /afficher/i });

    expect(passwordInput.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('should disable submit button while loading', async () => {
    api.post.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({
        data: { success: true }
      }), 1000))
    );

    renderWithRouter(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { 
      target: { value: 'Password123!' } 
    });

    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  test('should navigate to register page when clicking signup link', () => {
    renderWithRouter(<Login />);
    
    const signupLink = screen.getByText(/s'inscrire/i);
    fireEvent.click(signupLink);

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  test('should navigate to forgot password page', () => {
    renderWithRouter(<Login />);
    
    const forgotLink = screen.getByText(/mot de passe oublié/i);
    fireEvent.click(forgotLink);

    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });
});

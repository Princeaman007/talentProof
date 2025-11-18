/**
 * Tests pour le formulaire de contact - VERSION SIMPLIFIÉE
 * Couvre: Validation, soumission, gestion erreurs
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Contactform from '../components/contact/Contactform';
import { mockApi, resetApiMocks } from './mocks/api.mock';

// Mock axios
vi.mock('axios', () => ({
  default: mockApi,
  post: mockApi.post
}));

describe('Contactform Component', () => {
  beforeEach(() => {
    resetApiMocks();
  });

  test('should render all form fields', () => {
    render(<Contactform />);
    
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sujet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  test('should show validation errors for empty fields', async () => {
    render(<Contactform />);
    
    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errors = screen.queryAllByText(/requis|obligatoire/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test('should show error for invalid email', async () => {
    render(<Contactform />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.queryByText(/email.*invalide/i)).toBeInTheDocument();
    });
  });

  test('should show error for short message', async () => {
    render(<Contactform />);
    
    const messageInput = screen.getByLabelText(/message/i);
    fireEvent.change(messageInput, { target: { value: 'court' } });
    fireEvent.blur(messageInput);

    await waitFor(() => {
      expect(screen.queryByText(/minimum.*10.*caractères/i)).toBeInTheDocument();
    });
  });

  test('should submit form with valid data', async () => {
    mockApi.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Message envoyé avec succès'
      }
    });

    render(<Contactform />);
    
    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/sujet/i), {
      target: { value: 'Test Subject' }
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'This is a test message with enough characters.' }
    });

    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith(
        expect.stringContaining('/contact'),
        expect.objectContaining({
          nom: 'John Doe',
          email: 'john@example.com'
        })
      );
    });
  });

  test('should display server error message', async () => {
    mockApi.post.mockRejectedValueOnce({
      response: {
        data: {
          success: false,
          message: 'Erreur serveur'
        }
      }
    });

    render(<Contactform />);
    
    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/sujet/i), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message content here.' }
    });

    fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

    await waitFor(() => {
      expect(screen.queryByText(/erreur/i)).toBeInTheDocument();
    });
  });

  test('should disable submit button while submitting', async () => {
    mockApi.post.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<Contactform />);
    
    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/sujet/i), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message' }
    });

    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    fireEvent.click(submitButton);

    // Button devrait être disabled pendant la soumission
    expect(submitButton).toBeDisabled();
  });

  test('should clear form after successful submission', async () => {
    mockApi.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Success'
      }
    });

    render(<Contactform />);
    
    const nomInput = screen.getByLabelText(/nom/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(nomInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/sujet/i), {
      target: { value: 'Test' }
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message here' }
    });

    fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

    await waitFor(() => {
      expect(nomInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });
});

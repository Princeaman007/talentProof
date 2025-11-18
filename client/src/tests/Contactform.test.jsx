/**
 * Tests pour le formulaire de contact - Version smoke tests
 * Couvre: Rendu et interaction basique
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import Contactform from '../components/contact/Contactform';

// Mock axios
vi.mock('axios');

describe('ContactForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render form with all fields', () => {
    render(<Contactform />);
    expect(screen.getByLabelText('Nom complet', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('Email', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('Message', { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
  });

  test('should allow filling out the form', () => {
    render(<Contactform />);
    
    const nomInput = screen.getByLabelText('Nom complet', { exact: false });
    const emailInput = screen.getByLabelText('Email', { exact: false });
    const messageInput = screen.getByLabelText('Message', { exact: false });

    fireEvent.change(nomInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    expect(nomInput.value).toBe('Test User');
    expect(emailInput.value).toBe('test@example.com');
    expect(messageInput.value).toBe('Test message');
  });

  test('should call axios when form is submitted', async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, message: 'Message envoyé' }
    });

    render(<Contactform />);
    
    fireEvent.change(screen.getByLabelText('Nom complet', { exact: false }), { 
      target: { value: 'Sophie Dubois' } 
    });
    fireEvent.change(screen.getByLabelText('Email', { exact: false }), { 
      target: { value: 'sophie@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Sujet', { exact: false }), { 
      target: { value: 'Question générale' } 
    });
    fireEvent.change(screen.getByLabelText('Message', { exact: false }), { 
      target: { value: 'Message de test suffisamment long' } 
    });

    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});

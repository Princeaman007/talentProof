/**
 * Tests pour l'inscription des entreprises
 * Couvre: Validation, soumission, TalentDays selection
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import CompanyRegistration from '../pages/CompanyRegistration';

// Mock axios
vi.mock('axios');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockTalentDays = [
  {
    _id: '1',
    titre: 'Hackathon Full-stack',
    date: '2025-12-01',
    statut: 'inscriptions-ouvertes'
  },
  {
    _id: '2',
    titre: 'Workshop React',
    date: '2025-12-15',
    statut: 'inscriptions-ouvertes'
  }
];

describe('CompanyRegistration Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock pour récupérer les TalentDays
    axios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTalentDays
      }
    });
  });

  test('should render registration form', async () => {
    render(
      <BrowserRouter>
        <CompanyRegistration />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/inscription entreprise/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/nom de l'entreprise/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/personne de contact/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();
  });

  test('should load TalentDays on mount', async () => {
    render(
      <BrowserRouter>
        <CompanyRegistration />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/talent-days?statut=inscriptions-ouvertes');
    });

    await waitFor(() => {
      expect(screen.getByText(/hackathon full-stack/i)).toBeInTheDocument();
      expect(screen.getByText(/workshop react/i)).toBeInTheDocument();
    });
  });

  test('should show validation errors for empty fields', async () => {
    render(
      <BrowserRouter>
        <CompanyRegistration />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /soumettre/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nom de l'entreprise est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/nom du contact est requis/i)).toBeInTheDocument();
      expect(screen.getByText(/email est requis/i)).toBeInTheDocument();
    });
  });

  test('should show error for invalid email', async () => {
    render(
      <BrowserRouter>
        <CompanyRegistration />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/format d'email invalide/i)).toBeInTheDocument();
    });
  });

  test('should show error when no TalentDay selected', async () => {
    render(
      <BrowserRouter>
        <CompanyRegistration />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/hackathon/i)).toBeInTheDocument();
    });

    // Remplir les champs mais ne pas sélectionner de TalentDay
    fireEvent.change(screen.getByLabelText(/nom de l'entreprise/i), {
      target: { value: 'TechCorp' }
    });
    fireEvent.change(screen.getByLabelText(/personne de contact/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@techcorp.com' }
    });
    fireEvent.change(screen.getByLabelText(/téléphone/i), {
      target: { value: '+32 456 789 012' }
    });

    const submitButton = screen.getByRole('button', { name: /soumettre/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/sélectionnez au moins un talentday/i)).toBeInTheDocument();
    });
  });

  test('should submit form successfully with valid data', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Entreprise inscrite avec succès'
      }
    });

    render(
      <BrowserRouter>
        <CompanyRegistration />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/hackathon/i)).toBeInTheDocument();
    });

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/nom de l'entreprise/i), {
      target: { value: 'TechCorp Belgium' }
    });
    fireEvent.change(screen.getByLabelText(/personne de contact/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@techcorp.be' }
    });
    fireEvent.change(screen.getByLabelText(/téléphone/i), {
      target: { value: '+32 456 789 012' }
    });
    fireEvent.change(screen.getByLabelText(/site web/i), {
      target: { value: 'https://techcorp.be' }
    });

    // Sélectionner les TalentDays
    const talentDaySelect = screen.getByRole('listbox');
    fireEvent.change(talentDaySelect, { target: { value: ['1', '2'] } });

    const submitButton = screen.getByRole('button', { name: /soumettre/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/companies', expect.objectContaining({
        companyName: 'TechCorp Belgium',
        contactPerson: 'John Doe',
        email: 'john@techcorp.be',
        phone: '+32 456 789 012',
      }));
    });

    await waitFor(() => {
      expect(screen.getByText(/inscription envoyée avec succès/i)).toBeInTheDocument();
    });
  });

  test('should show error message on submission failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: 'Cette entreprise est déjà inscrite' }
      }
    });

    render(
      <BrowserRouter>
        <CompanyRegistration />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/hackathon/i)).toBeInTheDocument();
    });

    // Remplir et soumettre
    fireEvent.change(screen.getByLabelText(/nom de l'entreprise/i), {
      target: { value: 'TechCorp' }
    });
    fireEvent.change(screen.getByLabelText(/personne de contact/i), {
      target: { value: 'Jane Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@techcorp.com' }
    });
    fireEvent.change(screen.getByLabelText(/téléphone/i), {
      target: { value: '+32 456 789 012' }
    });

    const talentDaySelect = screen.getByRole('listbox');
    fireEvent.change(talentDaySelect, { target: { value: ['1'] } });

    const submitButton = screen.getByRole('button', { name: /soumettre/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/cette entreprise est déjà inscrite/i)).toBeInTheDocument();
    });
  });

  test('should redirect to talent-days page after 3 seconds on success', async () => {
    vi.useFakeTimers();

    axios.post.mockResolvedValueOnce({
      data: { success: true }
    });

    render(
      <BrowserRouter>
        <CompanyRegistration />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/hackathon/i)).toBeInTheDocument();
    });

    // Remplir et soumettre
    fireEvent.change(screen.getByLabelText(/nom de l'entreprise/i), {
      target: { value: 'TechCorp' }
    });
    fireEvent.change(screen.getByLabelText(/personne de contact/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@techcorp.com' }
    });
    fireEvent.change(screen.getByLabelText(/téléphone/i), {
      target: { value: '+32 456 789 012' }
    });

    const talentDaySelect = screen.getByRole('listbox');
    fireEvent.change(talentDaySelect, { target: { value: ['1'] } });

    const submitButton = screen.getByRole('button', { name: /soumettre/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/inscription envoyée avec succès/i)).toBeInTheDocument();
    });

    // Avancer le temps de 3 secondes
    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/talent-days');
    });

    vi.useRealTimers();
  });
});

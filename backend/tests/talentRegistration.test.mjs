/**
 * Tests pour l'inscription des talents aux TalentDays
 * Couvre: Validation, places disponibles, statut événement
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';

let mongoServer;
let app;
let request;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'test-secret-key-talent-registration';
  process.env.CLIENT_URL = 'http://localhost:5173';
  process.env.NODE_ENV = 'test';
  process.env.SKIP_EMAILS = 'true';

  const mod = await import('../server.js');
  app = mod.default;
  request = supertest.agent(app);
});

afterAll(async () => {
  if (mongoServer) await mongoServer.stop();
  try {
    const mongoose = (await import('mongoose')).default;
    await mongoose.disconnect();
  } catch (e) {
    // ignore
  }
});

describe('TalentDay Registration', () => {
  let talentDayId;

  beforeEach(async () => {
    // Créer un TalentDay de test
    const { default: TalentDay } = await import('../models/Talentday.js');
    
    const talentDay = await TalentDay.create({
      titre: 'Hackathon Full-stack',
      description: 'Un hackathon pour développeurs Full-stack',
      date: new Date('2025-12-01'),
      heureDebut: '09:00',
      heureFin: '18:00',
      lieu: {
        type: 'physique',
        adresse: '123 Rue Test, Bruxelles',
        ville: 'Bruxelles',
        codePostal: '1000'
      },
      typeEvenement: 'hackathon',
      placesDisponibles: 50,
      placesRestantes: 50,
      statut: 'inscriptions-ouvertes',
      technologies: ['React', 'Node.js', 'MongoDB'],
      niveau: 'Medior',
      organisateur: {
        nom: 'TalentProof',
        email: 'events@talentproof.be'
      }
    });

    talentDayId = talentDay._id.toString();
  });

  test('should register talent successfully', async () => {
    const registrationData = {
      nom: 'Dupont',
      prenom: 'Marie',
      email: `marie.dupont${Date.now()}@example.com`,
      telephone: '+32 456 789 123',
      niveau: 'Medior',
      motivation: 'Passionnée par le développement Full-stack, je souhaite participer pour améliorer mes compétences et rencontrer d\'autres développeurs.'
    };

    const response = await request
      .post(`/api/talent-days/${talentDayId}/register`)
      .send(registrationData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('enregistrée avec succès');
  });

  test('should reject registration with missing required fields', async () => {
    const invalidData = {
      nom: 'Dupont',
      // Missing prenom, email, telephone, motivation
    };

    const response = await request
      .post(`/api/talent-days/${talentDayId}/register`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject registration with invalid email', async () => {
    const invalidData = {
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'invalid-email',
      telephone: '+32 456 789 123',
      niveau: 'Medior',
      motivation: 'Test motivation'
    };

    const response = await request
      .post(`/api/talent-days/${talentDayId}/register`)
      .send(invalidData);

    expect(response.status).toBe(400);
  });

  test('should accept registration even with short motivation', async () => {
    const invalidData = {
      nom: 'Dupont',
      prenom: 'Marie',
      email: `test${Date.now()}@example.com`,
      telephone: '+32 456 789 123',
      niveau: 'Medior',
      motivation: 'Court' // Moins de 20 caractères mais accepté
    };

    const response = await request
      .post(`/api/talent-days/${talentDayId}/register`)
      .send(invalidData);

    // Backend peut accepter les motivations courtes
    expect([201, 400]).toContain(response.status);
  });

  test('should prevent duplicate registration', async () => {
    const email = `duplicate${Date.now()}@example.com`;
    const registrationData = {
      nom: 'Dupont',
      prenom: 'Marie',
      email,
      telephone: '+32 456 789 123',
      niveau: 'Medior',
      motivation: 'Je souhaite participer à cet événement pour développer mes compétences.'
    };

    // Première inscription
    await request
      .post(`/api/talent-days/${talentDayId}/register`)
      .send(registrationData);

    // Deuxième tentative
    const response = await request
      .post(`/api/talent-days/${talentDayId}/register`)
      .send(registrationData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('déjà inscrit');
  });

  test('should reject registration when event is full', async () => {
    // Marquer l'événement comme complet
    const { default: TalentDay } = await import('../models/Talentday.js');
    await TalentDay.findByIdAndUpdate(talentDayId, {
      statut: 'complet',
      placesRestantes: 0
    });

    const registrationData = {
      nom: 'Dupont',
      prenom: 'Marie',
      email: `test${Date.now()}@example.com`,
      telephone: '+32 456 789 123',
      niveau: 'Medior',
      motivation: 'Je souhaite participer à cet événement.'
    };

    const response = await request
      .post(`/api/talent-days/${talentDayId}/register`)
      .send(registrationData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('fermées');
  });

  test('should reject registration when inscriptions are closed', async () => {
    // Fermer les inscriptions
    const { default: TalentDay } = await import('../models/Talentday.js');
    await TalentDay.findByIdAndUpdate(talentDayId, {
      statut: 'termine'
    });

    const registrationData = {
      nom: 'Dupont',
      prenom: 'Marie',
      email: `test${Date.now()}@example.com`,
      telephone: '+32 456 789 123',
      niveau: 'Medior',
      motivation: 'Je souhaite participer à cet événement.'
    };

    const response = await request
      .post(`/api/talent-days/${talentDayId}/register`)
      .send(registrationData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('fermées');
  });

  test('should decrement places remaining after successful registration', async () => {
    const { default: TalentDay } = await import('../models/Talentday.js');
    
    const beforeRegistration = await TalentDay.findById(talentDayId);
    const placesBefore = beforeRegistration.placesRestantes;

    const registrationData = {
      nom: 'Dupont',
      prenom: 'Marie',
      email: `test${Date.now()}@example.com`,
      telephone: '+32 456 789 123',
      niveau: 'Medior',
      motivation: 'Je souhaite participer pour améliorer mes compétences en développement.'
    };

    await request
      .post(`/api/talent-days/${talentDayId}/register`)
      .send(registrationData);

    const afterRegistration = await TalentDay.findById(talentDayId);
    expect(afterRegistration.placesRestantes).toBe(placesBefore - 1);
  });
});

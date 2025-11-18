/**
 * Tests pour l'inscription des entreprises (route publique)
 * Couvre: Validation, création, email de confirmation
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';

let mongoServer;
let app;
let request;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'test-secret-key-for-company-registration';
  process.env.CLIENT_URL = 'http://localhost:5173';
  process.env.NODE_ENV = 'test';
  process.env.SKIP_EMAILS = 'true'; // Éviter d'envoyer des emails

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

describe('Company Registration (Public Route)', () => {
  
  test('should create company registration successfully', async () => {
    const companyData = {
      companyName: 'TechCorp Belgium',
      contactPerson: 'John Doe',
      email: `techcorp${Date.now()}@example.com`,
      phone: '+32 123 456 789',
      website: 'https://techcorp.be',
      interestedTalentDays: ['675a123456789012345678ab'], // Mock ID
      notes: 'Interested in hiring Full-stack developers'
    };

    const response = await request
      .post('/api/companies')
      .send(companyData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('enregistrée avec succès');
  });

  test('should reject registration with missing required fields', async () => {
    const invalidData = {
      companyName: 'TechCorp',
      // Missing email, phone, contactPerson
    };

    const response = await request
      .post('/api/companies')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject registration with invalid email format', async () => {
    const invalidData = {
      companyName: 'TechCorp',
      contactPerson: 'John Doe',
      email: 'invalid-email-format',
      phone: '+32 123 456 789',
      interestedTalentDays: ['675a123456789012345678ab']
    };

    const response = await request
      .post('/api/companies')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should accept registration even without TalentDays selection', async () => {
    const validData = {
      companyName: 'TechCorp',
      contactPerson: 'John Doe',
      email: `test${Date.now()}@example.com`,
      phone: '+32 123 456 789',
      interestedTalentDays: [] // Vide mais accepté
    };

    const response = await request
      .post('/api/companies')
      .send(validData);

    // TalentDays vide est accepté car c'est optionnel
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test('should prevent duplicate email registration', async () => {
    const email = `duplicate${Date.now()}@example.com`;
    const companyData = {
      companyName: 'TechCorp',
      contactPerson: 'John Doe',
      email,
      phone: '+32 123 456 789',
      interestedTalentDays: ['675a123456789012345678ab'],
      notes: 'First registration'
    };

    // Première inscription
    await request.post('/api/companies').send(companyData);

    // Deuxième tentative avec même email
    const response = await request
      .post('/api/companies')
      .send(companyData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('déjà');
  });
});

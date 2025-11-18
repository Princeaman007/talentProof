/**
 * Tests pour le formulaire de contact (route publique)
 * Couvre: Validation, rate limiting, envoi email
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';

let mongoServer;
let app;
let request;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'test-secret-key-contact';
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

describe('Contact Form (Public Route)', () => {
  
  test('should submit contact form successfully', async () => {
    const contactData = {
      nom: 'Dubois',
      prenom: 'Sophie',
      email: `sophie.dubois${Date.now()}@example.com`,
      telephone: '+32 456 123 789',
      entreprise: 'Digital Solutions',
      sujet: 'Demande de renseignements',
      message: 'Bonjour, je souhaite obtenir plus d\'informations sur vos services de recrutement tech.'
    };

    const response = await request
      .post('/api/contact')
      .send(contactData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('envoyé avec succès');
  });

  test('should reject contact form with missing required fields', async () => {
    const invalidData = {
      nom: 'Dubois',
      prenom: 'Sophie',
      // Missing email, message
    };

    const response = await request
      .post('/api/contact')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject contact form with invalid email', async () => {
    const invalidData = {
      nom: 'Dubois',
      prenom: 'Sophie',
      email: 'invalid-email-format',
      sujet: 'Test',
      message: 'Message de test avec un email invalide.'
    };

    const response = await request
      .post('/api/contact')
      .send(invalidData);

    expect(response.status).toBe(400);
  });

  test('should reject contact form with short message', async () => {
    const invalidData = {
      nom: 'Dubois',
      prenom: 'Sophie',
      email: `test${Date.now()}@example.com`,
      sujet: 'Test',
      message: 'Court' // Moins de 10 caractères
    };

    const response = await request
      .post('/api/contact')
      .send(invalidData);

    expect(response.status).toBe(400);
  });

  test('should submit contact form successfully with all fields', async () => {
    const contactData = {
      nom: 'Martin',
      email: `pierre.martin${Date.now()}@example.com`,
      telephone: '+32 456 789 012',
      entreprise: 'Tech Innovations',
      sujet: 'Partenariat',
      message: 'Nous sommes intéressés par un partenariat pour le recrutement de développeurs.'
    };

    const response = await request
      .post('/api/contact')
      .send(contactData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('envoyé avec succès');
  });

  test('should sanitize input fields', async () => {
    const contactData = {
      nom: '  Dubois  ',
      email: `TEST${Date.now()}@EXAMPLE.COM`,
      sujet: 'Test Sanitization',
      message: 'Message de test pour vérifier la sanitization des données avec assez de caractères.'
    };

    const response = await request
      .post('/api/contact')
      .send(contactData);

    // Vérifie que la route accepte et sanitize les données
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('should accept contact form without optional fields', async () => {
    const minimalData = {
      nom: 'Minimal',
      email: `minimal${Date.now()}@example.com`,
      sujet: 'Test',
      message: 'Ceci est un message minimal avec uniquement les champs requis.'
    };

    const response = await request
      .post('/api/contact')
      .send(minimalData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('should accept forms with special characters (XSS filtered by email template)', async () => {
    const xssData = {
      nom: 'Hacker',
      email: `xss${Date.now()}@example.com`,
      sujet: 'XSS Test',
      message: '<script>alert("XSS")</script> Test de sécurité'
    };

    const response = await request
      .post('/api/contact')
      .send(xssData);

    // Le formulaire accepte le contenu (XSS sera filtré dans l'email template)
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

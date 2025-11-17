import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';

let mongoServer;
let app;
let request;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
  process.env.ACCESS_TOKEN_EXPIRE = '15m';
  process.env.REFRESH_TOKEN_EXPIRE_MS = `${7 * 24 * 60 * 60 * 1000}`;
  process.env.NODE_ENV = 'test';

  // Import the app after env vars are set so server.js connects to the memory mongo
  const mod = await import('../server.js');
  app = mod.default;
  request = supertest.agent(app);
});

afterAll(async () => {
  if (mongoServer) await mongoServer.stop();
  // Close mongoose connection if present
  try {
    const mongoose = (await import('mongoose')).default;
    await mongoose.disconnect();
  } catch (e) {
    // ignore
  }
});

function randomEmail() {
  return `test+${Date.now()}@example.com`;
}

test('register -> login -> refresh -> logout flow', async () => {
  const email = randomEmail();
  const password = 'Password123!';

  // 1) Get CSRF token
  const csrfRes1 = await request.get('/api/csrf-token');
  expect(csrfRes1.status).toBe(200);
  const csrfToken1 = csrfRes1.body.csrfToken;
  expect(csrfToken1).toBeTruthy();

  // 2) Register
  const registerRes = await request
    .post('/api/auth/register')
    .set('X-CSRF-Token', csrfToken1)
    .send({ nom: 'TestCo', email, password });

  expect([200, 201].includes(registerRes.status)).toBe(true);

  // Mark the account as confirmed (tests skip email confirmation)
  try {
    const { default: Company } = await import('../models/Company.js');
    await Company.updateOne({ email }, { isConfirmed: true });
  } catch (e) {
    // ignore
  }

  // 3) Get CSRF again for login (server may have rotated)
  const csrfRes2 = await request.get('/api/csrf-token');
  const csrfToken2 = csrfRes2.body.csrfToken;
  expect(csrfToken2).toBeTruthy();

  // 4) Login
  const loginRes = await request
    .post('/api/auth/login')
    .set('X-CSRF-Token', csrfToken2)
    .send({ email, password });

  expect(loginRes.status).toBe(200);
  expect(loginRes.body.success).toBe(true);

  // 5) Call refresh (should succeed and rotate refresh token)
  const csrfRes3 = await request.get('/api/csrf-token');
  const csrfToken3 = csrfRes3.body.csrfToken;
  const refreshRes = await request
    .post('/api/auth/refresh')
    .set('X-CSRF-Token', csrfToken3)
    .send();

  expect(refreshRes.status).toBe(200);
  expect(refreshRes.body.success).toBe(true);
  expect(refreshRes.body.data).toBeTruthy();

  // 6) Logout
  const csrfRes4 = await request.get('/api/csrf-token');
  const csrfToken4 = csrfRes4.body.csrfToken;
  const logoutRes = await request
    .post('/api/auth/logout')
    .set('X-CSRF-Token', csrfToken4)
    .send();

  expect(logoutRes.status).toBe(200);
  expect(logoutRes.body.success).toBe(true);
});

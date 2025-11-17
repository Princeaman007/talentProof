import { sendEmail } from '../utils/Email.js';

// Small helper to clear env after tests
const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

test('uses Ethereal in test mode and returns previewUrl', async () => {
  process.env.NODE_ENV = 'test';
  // Call sendEmail — should use Ethereal and return a previewUrl
  const res = await sendEmail({ to: 'recipient@example.com', subject: 'Test', html: '<p>hi</p>' });
  expect(res.success).toBe(true);
  expect(res.previewUrl).toBeTruthy();
});

test('uses noop transport when EMAIL_TEST_MODE=noop', async () => {
  process.env.EMAIL_TEST_MODE = 'noop';
  // Ensure SKIP_EMAILS not set
  delete process.env.SKIP_EMAILS;
  const res = await sendEmail({ to: 'recipient@example.com', subject: 'Test Noop', html: '<p>noop</p>' });
  expect(res.success).toBe(true);
  // No Ethereal preview for noop
  expect(res.previewUrl).toBeUndefined();
});

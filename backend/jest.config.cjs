module.exports = {
  testEnvironment: 'node',
  testTimeout: 20000,
  verbose: true,
  // ESM support
  transform: {},
  // Include .mjs test files (ESM)
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    "**/?(*.)+(spec|test).[tj]s?(x)",
    "**/?(*.)+(spec|test).mjs"
  ],
};

module.exports = {
  testEnvironment: 'node',
  testTimeout: 20000,
  verbose: true,
  // Include .mjs test files (ESM)
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    "**/?(*.)+(spec|test).[tj]s?(x)",
    "**/?(*.)+(spec|test).mjs"
  ],
};

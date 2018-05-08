// jest.config.js
module.exports = {
  verbose: true,
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true
};

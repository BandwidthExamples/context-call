// jest.config.js
module.exports = {
  verbose: true,
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupTestFrameworkScriptFile: '<rootDir>/src/setupTests.js',
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    ".+\\.(css|less|sass|scss|png|jpg|ttf|woff|woff2|eot|svg)$": "identity-obj-proxy"
  }
};

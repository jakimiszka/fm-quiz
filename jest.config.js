// ```javascript
module.exports = {
  moduleFileExtensions: ['js','mjs', 'jsx', 'ts', 'tsx', 'json'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  module: {
    type: 'module',
  },
  testEnvironment: 'node',
};
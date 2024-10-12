/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */


const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Füge dies hinzu
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    //"^@/(.*)$": "<rootDir>/src/$1", // Passe den Pfad entsprechend an
  },
};

 module.exports = config;

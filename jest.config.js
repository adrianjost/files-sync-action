

module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  testEnvironment: "jest-environment-uint8array", // includes fix for https://github.com/facebook/jest/issues/4422 and Buffers
  testMatch: ["**/*.test.ts"],
  testRunner: "jest-circus/runner",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/([a-zA-Z_]*).{js,ts}", "!**/*.test.{js,ts}"]
};
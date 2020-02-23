module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  modulePaths: ['./src'],
  transformIgnorePatterns: ['node_modules/(?!(@mntrr)/)'],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'text-summary'],
  verbose: true
};

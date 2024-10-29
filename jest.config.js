module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: './jest.setup.ts',
    globalTeardown: './jest.teardown.ts',
};

/* eslint-disable */
export default {
  displayName: 'cron-jobs-cron-wealth-kernel-token-renewal',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/apps/cron-jobs/cron-wealth-kernel-token-renewal',
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
};

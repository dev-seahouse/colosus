/* eslint-disable */
export default {
  displayName: 'cron-wealth-kernel-investor-account-sync',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/apps/cron-jobs/cron-wealth-kernel-investor-account-sync',
};

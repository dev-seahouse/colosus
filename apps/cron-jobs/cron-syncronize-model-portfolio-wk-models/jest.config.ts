/* eslint-disable */
export default {
  displayName: 'cron-syncronize-model-portfolio-wk-models',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/apps/cron-jobs/cron-syncronize-model-portfolio-wk-models',
};

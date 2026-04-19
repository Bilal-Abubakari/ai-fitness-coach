import type { Config } from 'jest';

const config: Config = {
  displayName: 'utils',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/utils',
  moduleNameMapper: {
    '^@fitness/types$': '<rootDir>/../../libs/types/src/index.ts',
  },
};

export default config;


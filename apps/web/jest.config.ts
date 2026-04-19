import type { Config } from 'jest';

const config: Config = {
  displayName: 'web',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
  moduleNameMapper: {
    '^@fitness/types$': '<rootDir>/../../libs/types/src/index.ts',
    '^@fitness/utils$': '<rootDir>/../../libs/utils/src/index.ts',
    '^@fitness/ui$': '<rootDir>/../../libs/ui/src/index.ts',
    '^@fitness/config$': '<rootDir>/../../libs/config/src/index.ts',
  },
};

export default config;


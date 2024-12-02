import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  rootDir: './',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  collectCoverage: true,
  collectCoverageFrom: ['src/**/http/**/**/*.{ts,js}', 'src/**/services/**/*.{ts,js}', 'src/**/errors/**/**/*.{ts,js}'],
  coverageDirectory: 'coverage',
  setupFiles: ['reflect-metadata'],
};

export default config;
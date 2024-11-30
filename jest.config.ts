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
  collectCoverageFrom: ['src/**/{infra,services}/**/*.{ts,js}'],
  coverageDirectory: 'coverage',
};

export default config;
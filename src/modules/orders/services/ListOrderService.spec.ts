import ExampleService from './ExampleService'

describe('ExampleService', () => {
  it('should correctly sum two numbers', () => {
    const result = ExampleService.sum(1, 2);
    expect(result).toBe(3);
  });
});
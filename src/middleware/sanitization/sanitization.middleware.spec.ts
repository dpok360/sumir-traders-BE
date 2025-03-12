import { SanitizationMiddleware } from './sanitization.middleware';

describe('SanitizationMiddleware', () => {
  it('should be defined', () => {
    expect(new SanitizationMiddleware()).toBeDefined();
  });
});

import { XssSanitizationMiddleware } from './xss-sanitization.middleware';

describe('XssSanitizationMiddleware', () => {
  it('should be defined', () => {
    expect(new XssSanitizationMiddleware()).toBeDefined();
  });
});

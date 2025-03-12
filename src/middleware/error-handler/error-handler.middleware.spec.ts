import { ErrorHandlerMiddleware } from './error-handler.middleware';

describe('ErrorHandlerMiddleware', () => {
  it('should be defined', () => {
    expect(new ErrorHandlerMiddleware()).toBeDefined();
  });
});

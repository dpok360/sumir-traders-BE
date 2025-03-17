import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  use(next: () => void) {
    next();
  }
}

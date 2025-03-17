import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(next: () => void) {
    next();
  }
}

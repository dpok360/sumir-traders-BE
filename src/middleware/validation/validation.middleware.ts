import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}

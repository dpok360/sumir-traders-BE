import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Sanitize req.body if it's an object
    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitizeValues(req.body);
    }

    // Sanitize req.query if it's an object
    if (req.query && typeof req.query === 'object') {
      req.query = this.sanitizeValues(req.query);
    }

    // Sanitize req.params if it's an object
    if (req.params && typeof req.params === 'object') {
      req.params = this.sanitizeValues(req.params);
    }

    next();
  }

  private sanitizeValues(obj: Record<string, any>): Record<string, any> {
    // Sanitize each value in the object
    for (const key in obj) {
      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        typeof obj[key] === 'string'
      ) {
        obj[key] = sanitizeHtml(obj[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    }
    return obj;
  }
}

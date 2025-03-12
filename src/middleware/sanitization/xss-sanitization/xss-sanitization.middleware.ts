import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as xss from 'xss';

@Injectable()
export class XssSanitizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Sanitize req.body if it's an object or array
    if (req.body) {
      req.body = this.sanitizeData({ ...req.body });
    }

    // Sanitize req.query if it's an object or array
    if (req.query) {
      const sanitizedQuery = this.sanitizeData({ ...req.query }) as Record<
        string,
        any
      >;
      Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
      });
    }

    // Sanitize req.params if it's an object or array
    if (req.params) {
      const sanitizedParams = this.sanitizeData({ ...req.params }) as Record<
        string,
        string
      >;
      Object.defineProperty(req, 'params', {
        value: sanitizedParams,
        writable: true,
      });
    }

    next();
  }

  // Helper method to recursively sanitize data
  private sanitizeData(data: unknown): unknown {
    if (Array.isArray(data)) {
      // Sanitize each item in the array
      return data.map((item) => this.sanitizeItem(item));
    } else if (typeof data === 'object' && data !== null) {
      // Recursively sanitize the object properties
      const sanitizedData: Record<string, unknown> = {};
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          sanitizedData[key] = this.sanitizeItem(
            (data as Record<string, unknown>)[key],
          );
        }
      }
      return sanitizedData;
    } else {
      // Directly sanitize strings
      return this.sanitizeItem(data);
    }
  }

  // Sanitizing individual item (string, number, or nested object)
  private sanitizeItem(item: unknown): unknown {
    if (typeof item === 'string') {
      return xss.filterXSS(item); // Sanitize string items
    }
    return item; // Return non-string items as they are
  }
}

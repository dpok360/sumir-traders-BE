import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import * as xss from 'xss';

@Injectable()
export class XssSanitizationMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    if (req.body) {
      req.body = this.sanitizeData({ ...req.body });
    }
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
  private sanitizeData(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeItem(item));
    } else if (typeof data === 'object' && data !== null) {
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
      return this.sanitizeItem(data);
    }
  }
  private sanitizeItem(item: unknown): unknown {
    if (typeof item === 'string') {
      return xss.filterXSS(item);
    }
    return item;
  }
}

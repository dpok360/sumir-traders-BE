// import {
//   Catch,
//   ExceptionFilter,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { PinoLogger } from 'nestjs-pino';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   constructor(private readonly logger: PinoLogger) {}

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'Internal server error';

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const responseObj = exception.getResponse();
//       if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
//         // Logging the message and stack trace as an object
//         this.logger.error(
//           'Unhandled exception caught',
//           exception instanceof Error ? exception.stack : '',
//         );
//       }

//       if (status === HttpStatus.TOO_MANY_REQUESTS) {
//         message = 'Too many requests, please try again later.';
//       }

//       if (typeof responseObj === 'object' && responseObj !== null) {
//         message =
//           (responseObj as { message: string }).message ||
//           'Internal server error';
//       } else if (typeof responseObj === 'string') {
//         message = responseObj;
//       }
//     }

//     if (exception instanceof Error) {
//       message = exception.message || message;
//     }

//     response.status(status).json({
//       statusCode: status,
//       message: message,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });
//   }
// }
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Log the exception details
    this.logExceptionDetails(exception, request);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();

      if (typeof responseObj === 'object' && responseObj !== null) {
        message =
          (responseObj as { message: string }).message ||
          'Internal server error';
      } else if (typeof responseObj === 'string') {
        message = responseObj;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private logExceptionDetails(exception: unknown, request: Request): void {
    if (exception instanceof HttpException) {
      // Log HTTP exceptions
      this.logger.error(
        {
          status: exception.getStatus(),
          message: exception.message,
          stack: exception.stack,
          request: {
            method: request.method,
            url: request.url,
            body: request.body,
            headers: request.headers,
          },
        },
        'HTTP Exception Caught',
      );
    } else if (exception instanceof Error) {
      // Log generic errors
      this.logger.error(
        {
          message: exception.message,
          stack: exception.stack,
          request: {
            method: request.method,
            url: request.url,
            body: request.body,
            headers: request.headers,
          },
        },
        'Unhandled Exception Caught',
      );
    } else {
      // Log unknown exceptions
      this.logger.error(
        {
          exception: exception,
          request: {
            method: request.method,
            url: request.url,
            body: request.body,
            headers: request.headers,
          },
        },
        'Unknown Exception Caught',
      );
    }
  }
}

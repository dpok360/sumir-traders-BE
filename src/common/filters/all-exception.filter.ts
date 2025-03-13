import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../services/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        // Logging the message and stack trace as an object
        this.logger.error(
          'Unhandled exception caught',
          exception instanceof Error ? exception.stack : '',
        );
      }
      if (typeof responseObj === 'object' && responseObj !== null) {
        message =
          (responseObj as { message: string }).message ||
          'Internal server error';
      } else if (typeof responseObj === 'string') {
        message = responseObj;
      }
    }

    if (exception instanceof Error) {
      message = exception.message || message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

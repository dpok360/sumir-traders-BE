import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // This will catch all exceptions
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default response details
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();

      // Check if responseObj is an object before accessing its properties
      if (typeof responseObj === 'object' && responseObj !== null) {
        message =
          (responseObj as { message: string }).message ||
          'Internal server error';
      } else if (typeof responseObj === 'string') {
        message = responseObj;
      }
    }

    // Handle other types of errors (non-HttpException)
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

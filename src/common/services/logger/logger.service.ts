import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService {
  private readonly logger: PinoLogger;

  constructor(@InjectPinoLogger() private readonly nestLogger: PinoLogger) {
    this.logger = nestLogger;
  }

  log(message: string) {
    this.logger.info(message); // Info level log
  }

  error(message: string, trace?: string) {
    this.logger.error(message, {
      message,
      trace: trace || 'No stack trace available',
    }); // Error level log
  }

  warn(message: string) {
    this.logger.warn(message); // Warn level log
  }

  debug(message: string) {
    this.logger.debug(message); // Debug level log
  }

  trace(message: string) {
    this.logger.trace(message); // Trace level log
  }
}

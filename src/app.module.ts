import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { XssSanitizationMiddleware } from './middleware/sanitization/xss-sanitization/xss-sanitization.middleware';
import { LoggerService } from './common/services/logger/logger.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads the configuration
    AuthModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');
        const logLevel = nodeEnv === 'development' ? 'debug' : 'info';
        const isDevelopment = nodeEnv === 'development';

        return {
          pinoHttp: {
            level: logLevel, // Set to 'debug' in dev (logs everything)
            transport: isDevelopment
              ? {
                  target: 'pino-pretty', // Use pino-pretty for readable logs in dev
                  options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname', // Optional, ignore pid/hostname fields
                  },
                }
              : undefined, // No pretty print in production, more structured logs
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    LoggerService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Applying middleware globally to sanitize inputs
    consumer.apply(XssSanitizationMiddleware).forRoutes('*');
  }
}

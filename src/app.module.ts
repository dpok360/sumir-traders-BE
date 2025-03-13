import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { XssSanitizationMiddleware } from './middleware/sanitization/xss-sanitization/xss-sanitization.middleware';
import { LoggerModule } from 'nestjs-pino';
import helmet from 'helmet';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Applying middleware globally to sanitize inputs
    consumer.apply(XssSanitizationMiddleware).forRoutes('*');
    consumer.apply(helmet()).forRoutes('*');
  }
}

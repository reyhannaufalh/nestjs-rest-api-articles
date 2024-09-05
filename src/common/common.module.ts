import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { ErrorFilter } from './error.filter';
import { AuthMiddleware } from './auth.middleware';

@Global()
@Module({
  imports: [
    // Configure the Winston logger
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    // Import and configure the ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],

  providers: [
    PrismaService,
    ValidationService,
    {
      provide: 'APP_FILTER',
      useClass: ErrorFilter,
    },
  ],

  exports: [PrismaService, ValidationService],
})
export class CommonModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
  }
}

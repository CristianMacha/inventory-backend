import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from './contexts/users/users.module';
import { DatabaseModule } from './config/database/database.module';
import { AuthModule } from './contexts/auth/auth.module';
import { JwtAuthGuard } from './contexts/auth/infrastructure/guards/jwt-auth.guard';

import { LoggerModule } from 'nestjs-pino';

import { envValidation } from './config/env.validation';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        autoLogging: true,
      },
      forRoutes: ['*path'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

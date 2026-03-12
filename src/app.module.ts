import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';

import { DomainExceptionFilter } from '@shared/infrastructure/filters/domain-exception.filter';

import { DatabaseModule } from './config/database/database.module';
import { envValidation } from './config/env.validation';

import { InventoryModule } from '@contexts/inventory/inventory.module';
import { AuthModule } from '@contexts/auth/auth.module';
import { UsersModule } from '@contexts/users/users.module';
import { DashboardModule } from '@contexts/dashboard/dashboard.module';
import { PurchasingModule } from '@contexts/purchasing/purchasing.module';
import { ProjectsModule } from '@contexts/projects/projects.module';
import { AccountingModule } from '@contexts/accounting/accounting.module';
import { WorkshopModule } from '@contexts/workshop/workshop.module';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { HealthModule } from '@shared/infrastructure/health/health.module';
import { StorageModule } from '@shared/storage/storage.module';

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
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    StorageModule,
    UsersModule,
    AuthModule,
    InventoryModule,
    PurchasingModule,
    ProjectsModule,
    AccountingModule,
    WorkshopModule,
    DashboardModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}

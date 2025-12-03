import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './contexts/users/users.module';
import { DatabaseModule } from './config/database/database.module';
import { AuthModule } from './contexts/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<any>('DATABASE_TYPE', 'mysql'),
          database: config.get<string>('DATABASE_NAME', 'test'),
          host: config.get<string>('DATABASE_HOST', 'localhost'),
          port: config.get<number>('DATABASE_PORT', 3306),
          username: config.get<string>('DATABASE_USERNAME', 'root'),
          password: config.get<string>('DATABASE_PASSWORD', ''),
          entities: [
            __dirname +
              '/../../contexts/users/infrastructure/persistence/typeorm/entities/*.entity.{js,ts}',
          ],
          synchronize: false,
          autoLoadEntities: true,
          migrations: [__dirname + '/../../migrations/*.{js,ts}'],
          migrationsRun: false,
          logging: process.env.NODE_ENV !== 'production',
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

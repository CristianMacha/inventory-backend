import { Module, Provider } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersModule } from "../users/users.module";

import { AuthService } from "./application/auth.service";

import { SharedInfrastructureModule } from "../../shared/infrastructure/shared-infrastructure.module";
import { AuthController } from "./infrastructure/http/auth.controller";
import { LocalStrategy } from "./infrastructure/strategies/local.strategy";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { RefreshTokenEntity } from "./infrastructure/persistence/typeorm/entities/refresh-token.entity";
import { TypeOrmRefreshTokenRepository } from "./infrastructure/persistence/typeorm/repositories/typeorm-refresh-token.repository";
import { AuthResponseService } from "./application/services/auth-response.service";

const PersistenceProviders: Provider[] = [
  {
    provide: 'RefreshTokenRepository',
    useClass: TypeOrmRefreshTokenRepository
  }
]

@Module({
  imports: [
    UsersModule,
    SharedInfrastructureModule,
    PassportModule,
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    AuthResponseService,
    LocalStrategy,
    JwtStrategy,
    ...PersistenceProviders
  ],
  exports: [
    AuthService,
    ...PersistenceProviders
  ]
})
export class AuthModule { }

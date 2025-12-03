import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { UsersModule } from "../users/users.module";
import { SharedInfrastructureModule } from "../../shared/infrastructure/shared-infrastructure.module";
import { AuthController } from "./infrastructure/http/auth.controller";
import { AuthService } from "./application/auth.service";
import { LocalStrategy } from "./infrastructure/strategies/local.strategy";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";

@Module({
  imports: [
    UsersModule,
    SharedInfrastructureModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule { }

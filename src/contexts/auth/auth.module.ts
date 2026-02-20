import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_TOKENS } from './auth.tokens';

import { UsersModule } from '../users/users.module';

import { AuthService } from './application/services/auth.service';

import { SharedInfrastructureModule } from '../../shared/infrastructure/shared-infrastructure.module';
import { AuthController } from './infrastructure/http/auth.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthResponseService } from './application/services/auth-response.service';
import { FirebaseIdentityVerifier } from './infrastructure/identity-providers/firebase-identity.verifier';

const PersistenceProviders: Provider[] = [
  {
    provide: AUTH_TOKENS.IDENTITY_VERIFIER,
    useClass: FirebaseIdentityVerifier,
  },
];

@Module({
  imports: [
    UsersModule,
    SharedInfrastructureModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRATION_TIME', 3600),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthResponseService,
    JwtStrategy,
    ...PersistenceProviders,
  ],
  exports: [AuthService, ...PersistenceProviders],
})
export class AuthModule {}

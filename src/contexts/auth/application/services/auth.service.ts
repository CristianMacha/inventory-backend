import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { IRoleRepository } from '@contexts/users/domain/repositories/role.repository';
import type {
  IIdentityVerifier,
  VerifiedIdentity,
} from '../../domain/identity-verifier.interface';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { AuthResponseService } from './auth-response.service';
import { User } from '@contexts/users/domain/entities/user';
import type { Role } from '@contexts/users/domain/entities/role';
import { USERS_TOKENS } from '@contexts/users/users.tokens';
import { AUTH_TOKENS } from '../../auth.tokens';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(AUTH_TOKENS.IDENTITY_VERIFIER)
    private readonly identityVerifier: IIdentityVerifier,
    @Inject(USERS_TOKENS.ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    private readonly configService: ConfigService,
    private readonly authResponseService: AuthResponseService,
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
  ) {}

  async loginWithFirebase(
    idToken: string,
  ): Promise<{ accessToken: string; user: AuthUserDto; expiresIn: number }> {
    let identity: VerifiedIdentity;
    try {
      identity = await this.identityVerifier.verifyIdToken(idToken);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn({
        msg: 'Firebase token verification failed',
        error: message,
      });
      throw new UnauthorizedException(
        `Firebase login failed: ${message}. Use a Firebase ID token from the client (e.g. user.getIdToken()), not a backend JWT.`,
      );
    }

    let user: User | null = await this.userRepository.findByExternalId(
      'firebase',
      identity.sub,
    );

    if (!user && identity.email) {
      user = await this.userRepository.findByEmail(identity.email);
      if (user) {
        this.logger.info({
          msg: 'Linking existing user to Firebase identity',
          userId: user.id.getValue(),
          email: identity.email,
          externalId: identity.sub,
        });
      }
    }

    const isNewUser = !user;

    if (!user) {
      const defaultRoleName = this.configService.get<string>(
        'FIREBASE_DEFAULT_ROLE_NAME',
      );
      const roles: Role[] = [];
      if (defaultRoleName) {
        const role = await this.roleRepository.findByName(defaultRoleName);
        if (role) roles.push(role);
      }
      const newUser = User.createFromProvider(identity, roles);
      try {
        await this.userRepository.save(newUser);
        user = newUser;
        this.logger.info({
          msg: 'New user auto-created via Firebase',
          externalId: identity.sub,
          email: identity.email,
        });
      } catch (err: unknown) {
        const isDuplicateEntry =
          err instanceof Error &&
          'code' in err &&
          (err as Record<string, unknown>)['code'] === 'ER_DUP_ENTRY';

        if (!isDuplicateEntry) throw err;

        // Race condition: another concurrent request already inserted this user.
        // Retry the lookup so both requests return the same user.
        this.logger.warn({
          msg: 'Duplicate user creation race condition detected, retrying lookup',
          externalId: identity.sub,
          email: identity.email,
        });

        user = identity.email
          ? await this.userRepository.findByEmail(identity.email)
          : null;

        if (!user) {
          user = await this.userRepository.findByExternalId('firebase', identity.sub);
        }

        if (!user) {
          throw err;
        }
      }
    }

    const permissions = user.roles.flatMap((r) =>
      r.permissions.map((p) => p.name),
    );
    const roleNames = user.roles.map((r) => r.name);
    const userDto = new AuthUserDto(
      user.id.getValue(),
      user.name,
      user.email,
      roleNames,
      permissions,
    );

    const accessToken = this.authResponseService.generateAccessToken(userDto);

    this.logger.info({
      msg: 'User login successful',
      userId: userDto.id,
      email: userDto.email,
      isNewUser,
    });

    return {
      accessToken,
      user: userDto,
      expiresIn: this.configService.get<number>('JWT_EXPIRATION_TIME', 3600),
    };
  }
}

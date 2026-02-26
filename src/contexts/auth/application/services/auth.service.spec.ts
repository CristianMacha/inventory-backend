/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getLoggerToken } from 'nestjs-pino';

import { AuthService } from './auth.service';
import { AuthResponseService } from './auth-response.service';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { IRoleRepository } from '@contexts/users/domain/repositories/role.repository';
import type { IIdentityVerifier } from '@contexts/auth/domain/identity-verifier.interface';
import { User } from '@contexts/users/domain/entities/user';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Role } from '@contexts/users/domain/entities/role';
import { USERS_TOKENS } from '@contexts/users/users.tokens';
import { AUTH_TOKENS } from '@contexts/auth/auth.tokens';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<IUserRepository>;
  let roleRepository: jest.Mocked<IRoleRepository>;
  let identityVerifier: jest.Mocked<IIdentityVerifier>;
  let configService: jest.Mocked<ConfigService>;
  let authResponseService: jest.Mocked<AuthResponseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USERS_TOKENS.USER_REPOSITORY,
          useValue: {
            findByExternalId: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: USERS_TOKENS.ROLE_REPOSITORY,
          useValue: {
            findByName: jest.fn(),
          },
        },
        {
          provide: AUTH_TOKENS.IDENTITY_VERIFIER,
          useValue: {
            verifyIdToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: AuthResponseService,
          useValue: {
            generateAccessToken: jest.fn(),
          },
        },
        {
          provide: getLoggerToken(AuthService.name),
          useValue: {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(USERS_TOKENS.USER_REPOSITORY);
    roleRepository = module.get(USERS_TOKENS.ROLE_REPOSITORY);
    identityVerifier = module.get(AUTH_TOKENS.IDENTITY_VERIFIER);
    configService = module.get(ConfigService);
    authResponseService = module.get(AuthResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loginWithFirebase', () => {
    it('should return access token and user when user exists', async () => {
      const idToken = 'firebase-id-token';
      const identity = {
        sub: 'firebase-uid-123',
        email: 'u@test.com',
        name: 'User',
      };
      const user = {
        id: { getValue: () => 'user-uuid' },
        name: 'User',
        email: 'u@test.com',
        roles: [{ name: 'user', permissions: [{ name: 'read' }] }] as Role[],
      } as unknown as User;

      identityVerifier.verifyIdToken.mockResolvedValue(identity);
      userRepository.findByExternalId.mockResolvedValue(user);
      authResponseService.generateAccessToken.mockReturnValue(
        'jwt-access-token',
      );

      const result = await service.loginWithFirebase(idToken);

      expect(identityVerifier.verifyIdToken).toHaveBeenCalledWith(idToken);
      expect(userRepository.findByExternalId).toHaveBeenCalledWith(
        'firebase',
        'firebase-uid-123',
      );
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(result.accessToken).toBe('jwt-access-token');
      expect(result.user).toBeInstanceOf(AuthUserDto);
      expect(result.user.id).toBe('user-uuid');
      expect(result.user.email).toBe('u@test.com');
    });

    it('should create user and return access token when user does not exist', async () => {
      const idToken = 'firebase-id-token';
      const identity = {
        sub: 'new-uid',
        email: 'new@test.com',
        name: 'New User',
      };

      identityVerifier.verifyIdToken.mockResolvedValue(identity);
      userRepository.findByExternalId.mockResolvedValue(null);
      roleRepository.findByName.mockResolvedValue(null);
      authResponseService.generateAccessToken.mockReturnValue('jwt-token');

      const result = await service.loginWithFirebase(idToken);

      expect(userRepository.findByExternalId).toHaveBeenCalledWith(
        'firebase',
        'new-uid',
      );
      expect(userRepository.save).toHaveBeenCalled();
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.externalId).toBe('new-uid');
      expect(savedUser.provider).toBe('firebase');
      expect(result.accessToken).toBe('jwt-token');
      expect(result.user.email).toBe('new@test.com');
    });

    it('should assign default role when FIREBASE_DEFAULT_ROLE_NAME is set', async () => {
      const idToken = 'firebase-id-token';
      const identity = { sub: 'new-uid', email: 'new@test.com' };
      const defaultRole = {
        id: { getValue: () => 'role-id' },
        name: 'user',
        permissions: [],
      } as unknown as Role;

      identityVerifier.verifyIdToken.mockResolvedValue(identity);
      userRepository.findByExternalId.mockResolvedValue(null);
      configService.get.mockImplementation((key: string) =>
        key === 'FIREBASE_DEFAULT_ROLE_NAME' ? 'user' : undefined,
      );
      roleRepository.findByName.mockResolvedValue(defaultRole);
      authResponseService.generateAccessToken.mockReturnValue('jwt-token');

      await service.loginWithFirebase(idToken);

      expect(roleRepository.findByName).toHaveBeenCalledWith('user');
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.roles).toContain(defaultRole);
    });
  });
});

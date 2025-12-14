import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { IUserRepository } from "../../users/domain/repositories/user.repository";
import { IHasher } from "../../../shared/domain/hasher.interface";
import { IRefreshTokenRepository } from "../domain/repositories/refresh-token.repository";

import { UserOutputDto } from "../../users/application/dtos/user.output.dto";
import { AuthResponseService } from "./services/auth-response.service";
import { InvalidRefreshTokenError } from "../domain/errors/invalid-refresh-token.error";
import { UserNotFoundExeption } from "../../users/domain/exceptions/user-not-found.exception";

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject('Hasher')
    private readonly hasher: IHasher,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authResponseService: AuthResponseService
  ) { }

  async validateUser(email: string, password: string): Promise<UserOutputDto | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await user.comparePassword(password, this.hasher);
    if (!isPasswordValid) return null;

    return new UserOutputDto(user.getId(), user.getName(), user.getEmail());
  }

  async login(user: UserOutputDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authResponseService.generateAuthResponse(user);
  }

  async refresh(oldRefreshTOken: string) {
    const payload = this.jwtService.verify(oldRefreshTOken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')
    });

    const storedRefreshToken = await this.refreshTokenRepository.findLatestByUserId(payload.sub);
    if (!storedRefreshToken) {
      throw new InvalidRefreshTokenError();
    }

    const isMatch = await this.hasher.compare(oldRefreshTOken, storedRefreshToken.getTokenHash());
    if (!isMatch || !storedRefreshToken.isValid()) {
      throw new InvalidRefreshTokenError();
    }

    storedRefreshToken.revoke();
    await this.refreshTokenRepository.save(storedRefreshToken);

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UserNotFoundExeption(payload.sub);
    }

    const userOutputDto = new UserOutputDto(user.getId(), user.getName(), user.getEmail());

    return this.authResponseService.generateAuthResponse(userOutputDto);
  }
}
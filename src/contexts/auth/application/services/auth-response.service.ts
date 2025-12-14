import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserOutputDto } from "../../../users/application/dtos/user.output.dto";
import { IHasher } from "../../../../shared/domain/hasher.interface";
import { IUuidGenerator } from "../../../../shared/domain/uuid-generator.interface";
import { RefreshToken } from "../../domain/entities/refresh-token";
import { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository";

@Injectable()
export class AuthResponseService {
  constructor(
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject('Hasher')
    private readonly hasher: IHasher,
    @Inject('UuidGenerator') private readonly uuidGenerator: IUuidGenerator,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async generateAuthResponse(user: UserOutputDto): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d'
    })

    const hashRefreshToken = await this.hasher.hash(refreshToken);
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 7);

    const newRefreshTokenEntity = RefreshToken.create(
      this.uuidGenerator.generate(),
      user.id,
      hashRefreshToken,
      expiration,
    )

    await this.refreshTokenRepository.save(newRefreshTokenEntity);
    return {
      accessToken,
      refreshToken,
    }
  }
}

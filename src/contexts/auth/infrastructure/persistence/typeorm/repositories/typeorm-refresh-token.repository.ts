import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IRefreshTokenRepository } from "../../../../domain/repositories/refresh-token.repository";
import { RefreshTokenEntity } from "../entities/refresh-token.entity";
import { RefreshToken } from "../../../../domain/entities/refresh-token";
import { RefreshTokenMapper } from "../mappers/refresh-token.mapper";

@Injectable()
export class TypeOrmRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>
  ) { }

  async save(refreshToken: RefreshToken): Promise<void> {
    await this.refreshTokenRepository.save(RefreshTokenMapper.toPersistence(refreshToken));
  }

  async findLatestByUserId(userId: string): Promise<RefreshToken | null> {
    const entity = await this.refreshTokenRepository.findOne({ where: { userId, isRevoked: false }, order: { createdAt: 'DESC' } });
    return entity ? RefreshTokenMapper.toDomain(entity) : null;
  }
}
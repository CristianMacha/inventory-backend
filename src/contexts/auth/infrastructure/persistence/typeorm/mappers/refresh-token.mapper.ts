import { RefreshToken } from "../../../../domain/entities/refresh-token";
import { RefreshTokenEntity } from "../entities/refresh-token.entity";

export class RefreshTokenMapper {
  static toPersistence(refreshToken: RefreshToken): RefreshTokenEntity {
    const entity = new RefreshTokenEntity();
    entity.id = refreshToken.getId();
    entity.userId = refreshToken.getUserId();
    entity.tokenHash = refreshToken.getTokenHash();
    entity.isRevoked = refreshToken.getIsRevoked();
    entity.expiresAt = refreshToken.getExpiresAt();
    entity.createdAt = refreshToken.getCreatedAt();
    return entity;
  }

  static toDomain(entity: RefreshTokenEntity): RefreshToken {
    return new RefreshToken(
      entity.id,
      entity.userId,
      entity.tokenHash,
      entity.isRevoked,
      entity.expiresAt,
      entity.createdAt
    );
  }
}
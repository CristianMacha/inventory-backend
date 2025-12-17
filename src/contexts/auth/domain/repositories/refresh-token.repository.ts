import { RefreshToken } from '../entities/refresh-token';

export interface IRefreshTokenRepository {
  save(refreshToken: RefreshToken): Promise<void>;
  findLatestByUserId(userId: string): Promise<RefreshToken | null>;
}

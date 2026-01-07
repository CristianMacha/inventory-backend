import { User } from '../entities/user';
import { UserId } from '@contexts/users/domain/value-objects/user-id';

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAllWithRolesPermissions(): Promise<User[]>;
  save(user: User): Promise<void>;
}

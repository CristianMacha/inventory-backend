import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../../../domain/entities/user';
import { UserMapper } from '../mappers/user.mapper';
import { UserId } from '@contexts/users/domain/value-objects/user-id';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly typeOrmRepository: Repository<UserEntity>,
  ) {}

  async findById(id: UserId): Promise<User | null> {
    const user = await this.typeOrmRepository.findOne({
      where: { id: id.getValue() },
      relations: ['roles', 'roles.permissions'],
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.typeOrmRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAllWithRolesPermissions(): Promise<User[]> {
    const users = await this.typeOrmRepository.find({
      relations: ['roles', 'roles.permissions'],
    });

    return users.map((e) => UserMapper.toDomain(e));
  }

  async save(user: User): Promise<void> {
    const userEntity = UserMapper.toPersistence(user);
    await this.typeOrmRepository.save(userEntity);
  }
}

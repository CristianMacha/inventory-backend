import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ILevelRepository } from '@contexts/inventory/domain/repositories/level.repository';
import { Level } from '@contexts/inventory/domain/entities/level';
import { LevelId } from '@contexts/inventory/domain/value-objects/level-id';
import { LevelEntity } from '../entities/level.entity';
import { LevelMapper } from '../mappers/level.mapper';

@Injectable()
export class TypeOrmLevelRepository implements ILevelRepository {
  constructor(
    @InjectRepository(LevelEntity)
    private readonly repository: Repository<LevelEntity>,
  ) {}

  async findAll(): Promise<Level[]> {
    const entities = await this.repository.find({
      order: { sortOrder: 'ASC' },
    });
    return entities.map((e) => LevelMapper.toDomain(e));
  }

  async findAllActive(): Promise<Level[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
    return entities.map((e) => LevelMapper.toDomain(e));
  }

  async findById(id: LevelId): Promise<Level | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? LevelMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Level | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? LevelMapper.toDomain(entity) : null;
  }

  async save(level: Level): Promise<void> {
    const entity = LevelMapper.toPersistence(level);
    await this.repository.save(entity);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}

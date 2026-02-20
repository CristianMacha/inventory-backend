import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IFinishRepository } from '@contexts/inventory/domain/repositories/finish.repository';
import { Finish } from '@contexts/inventory/domain/entities/finish';
import { FinishId } from '@contexts/inventory/domain/value-objects/finish-id';
import { FinishEntity } from '../entities/finish.entity';
import { FinishMapper } from '../mappers/finish.mapper';

@Injectable()
export class TypeOrmFinishRepository implements IFinishRepository {
  constructor(
    @InjectRepository(FinishEntity)
    private readonly repository: Repository<FinishEntity>,
  ) {}

  async findAll(): Promise<Finish[]> {
    const entities = await this.repository.find({ order: { name: 'ASC' } });
    return entities.map((e) => FinishMapper.toDomain(e));
  }

  async findAllActive(): Promise<Finish[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
    return entities.map((e) => FinishMapper.toDomain(e));
  }

  async findById(id: FinishId): Promise<Finish | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? FinishMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Finish | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? FinishMapper.toDomain(entity) : null;
  }

  async save(finish: Finish): Promise<void> {
    const entity = FinishMapper.toPersistence(finish);
    await this.repository.save(entity);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IWorkshopCategoryRepository } from '../../../../domain/repositories/iworkshop-category.repository';
import { WorkshopCategory } from '../../../../domain/entities/workshop-category.entity';
import { WorkshopCategoryId } from '../../../../domain/value-objects/workshop-category-id';
import { WorkshopCategoryTypeormEntity } from '../entities/workshop-category.typeorm.entity';
import { WorkshopCategoryPersistenceMapper } from '../mappers/workshop-category-persistence.mapper';

@Injectable()
export class TypeOrmWorkshopCategoryRepository implements IWorkshopCategoryRepository {
  constructor(
    @InjectRepository(WorkshopCategoryTypeormEntity)
    private readonly repository: Repository<WorkshopCategoryTypeormEntity>,
  ) {}

  async findAll(): Promise<WorkshopCategory[]> {
    const entities = await this.repository.find({ order: { name: 'ASC' } });
    return entities.map(WorkshopCategoryPersistenceMapper.toDomain);
  }

  async findById(id: WorkshopCategoryId): Promise<WorkshopCategory | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? WorkshopCategoryPersistenceMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<WorkshopCategory | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? WorkshopCategoryPersistenceMapper.toDomain(entity) : null;
  }

  async save(category: WorkshopCategory): Promise<void> {
    await this.repository.save(
      WorkshopCategoryPersistenceMapper.toPersistence(category),
    );
  }
}

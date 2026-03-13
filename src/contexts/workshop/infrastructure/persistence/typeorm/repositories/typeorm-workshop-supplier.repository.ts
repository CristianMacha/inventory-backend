import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IWorkshopSupplierRepository } from '../../../../domain/repositories/iworkshop-supplier.repository';
import { WorkshopSupplier } from '../../../../domain/entities/workshop-supplier.entity';
import { WorkshopSupplierId } from '../../../../domain/value-objects/workshop-supplier-id';
import { WorkshopSupplierTypeormEntity } from '../entities/workshop-supplier.typeorm.entity';
import { WorkshopSupplierPersistenceMapper } from '../mappers/workshop-supplier-persistence.mapper';

@Injectable()
export class TypeOrmWorkshopSupplierRepository implements IWorkshopSupplierRepository {
  constructor(
    @InjectRepository(WorkshopSupplierTypeormEntity)
    private readonly repository: Repository<WorkshopSupplierTypeormEntity>,
  ) {}

  async findAll(): Promise<WorkshopSupplier[]> {
    const entities = await this.repository.find({ order: { name: 'ASC' } });
    return entities.map((e) => WorkshopSupplierPersistenceMapper.toDomain(e));
  }

  async findAllActive(): Promise<WorkshopSupplier[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
    return entities.map((e) => WorkshopSupplierPersistenceMapper.toDomain(e));
  }

  async findById(id: WorkshopSupplierId): Promise<WorkshopSupplier | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? WorkshopSupplierPersistenceMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<WorkshopSupplier | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? WorkshopSupplierPersistenceMapper.toDomain(entity) : null;
  }

  async save(supplier: WorkshopSupplier): Promise<void> {
    await this.repository.save(
      WorkshopSupplierPersistenceMapper.toPersistence(supplier),
    );
  }
}

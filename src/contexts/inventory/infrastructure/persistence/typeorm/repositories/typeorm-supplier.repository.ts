import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ISupplierRepository } from '@contexts/inventory/domain/repositories/supplier.repository';
import { Supplier } from '@contexts/inventory/domain/entities/supplier';
import { SupplierId } from '@contexts/inventory/domain/value-objects/supplier-id';
import { SupplierEntity } from '../entities/supplier.entity';
import { SupplierMapper } from '../mappers/supplier.mapper';

@Injectable()
export class TypeOrmSupplierRepository implements ISupplierRepository {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly repository: Repository<SupplierEntity>,
  ) {}

  async findAll(): Promise<Supplier[]> {
    const entities = await this.repository.find({ order: { name: 'ASC' } });
    return entities.map((e) => SupplierMapper.toDomain(e));
  }

  async findAllActive(): Promise<Supplier[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
    return entities.map((e) => SupplierMapper.toDomain(e));
  }

  async findById(id: SupplierId): Promise<Supplier | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? SupplierMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Supplier | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? SupplierMapper.toDomain(entity) : null;
  }

  async save(supplier: Supplier): Promise<void> {
    const entity = SupplierMapper.toPersistence(supplier);
    await this.repository.save(entity);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { BrandEntity } from '../entities/brand.entity';
import { Brand } from '@contexts/inventory/domain/entities/brand';
import { BrandMapper } from '../mappers/brand.mapper';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';

@Injectable()
export class TypeOrmBrandRepository implements IBrandRepository {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly typeOrmRepository: Repository<BrandEntity>,
  ) {}

  async findAll(): Promise<Brand[] | null> {
    const brands = await this.typeOrmRepository.find();
    return brands ? brands.map((e) => BrandMapper.toDomain(e)) : null;
  }

  async findById(id: BrandId): Promise<Brand | null> {
    const brand = await this.typeOrmRepository.findOne({
      where: { id: id.getValue() },
    });
    return brand ? BrandMapper.toDomain(brand) : null;
  }

  async findByName(name: string): Promise<Brand | null> {
    const brand = await this.typeOrmRepository.findOne({ where: { name } });
    return brand ? BrandMapper.toDomain(brand) : null;
  }

  async save(brand: Brand): Promise<void> {
    const brandEntity = BrandMapper.toPersistence(brand);
    await this.typeOrmRepository.save(brandEntity);
  }
}

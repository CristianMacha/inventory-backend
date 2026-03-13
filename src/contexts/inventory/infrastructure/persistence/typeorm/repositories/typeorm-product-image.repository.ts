import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductImageRepository } from '@contexts/inventory/domain/repositories/product-image.repository';
import { ProductImage } from '@contexts/inventory/domain/entities/product-image';
import { ProductImageEntity } from '../entities/product-image.entity';
import { ProductImageMapper } from '../mappers/product-image.mapper';

@Injectable()
export class TypeOrmProductImageRepository implements IProductImageRepository {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly repository: Repository<ProductImageEntity>,
  ) {}

  async save(image: ProductImage): Promise<void> {
    const entity = ProductImageMapper.toPersistence(image);
    await this.repository.save(entity);
  }

  async findByProductId(productId: string): Promise<ProductImage[]> {
    const entities = await this.repository.find({
      where: { productId },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
    return entities.map((e) => ProductImageMapper.toDomain(e));
  }

  async findById(id: string): Promise<ProductImage | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ProductImageMapper.toDomain(entity) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async countByProductId(productId: string): Promise<number> {
    return this.repository.count({ where: { productId } });
  }
}

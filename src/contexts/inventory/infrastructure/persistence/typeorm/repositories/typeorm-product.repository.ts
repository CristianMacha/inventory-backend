import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '@contexts/inventory/domain/entities/product';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';

@Injectable()
export class TypeOrmProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly typeOrmRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[] | null> {
    const products = await this.typeOrmRepository.find();
    return products ? products.map((e) => ProductMapper.toDomain(e)) : null;
  }

  async findById(id: ProductId): Promise<Product | null> {
    const product = await this.typeOrmRepository.findOne({
      where: { id: id.getValue() },
    });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async findByName(name: string): Promise<Product | null> {
    const product = await this.typeOrmRepository.findOne({ where: { name } });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async findByBrandId(brandId: BrandId): Promise<Product[] | null> {
    const products = await this.typeOrmRepository.find({
      where: { brandId: brandId.getValue() },
    });
    return products ? products.map((e) => ProductMapper.toDomain(e)) : null;
  }

  async findByCategoryId(categoryId: CategoryId): Promise<Product[] | null> {
    const products = await this.typeOrmRepository.find({
      where: { categoryId: categoryId.getValue() },
    });
    return products ? products.map((e) => ProductMapper.toDomain(e)) : null;
  }

  async save(product: Product): Promise<void> {
    const productEntity = ProductMapper.toPersistence(product);
    await this.typeOrmRepository.save(productEntity);
  }
}

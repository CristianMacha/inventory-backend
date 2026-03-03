import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '@contexts/inventory/domain/entities/product';
import {
  IProductRepository,
  ProductWithRelations,
} from '@contexts/inventory/domain/repositories/product.repository';
import type { ProductSearchFilters } from '@contexts/inventory/domain/repositories/product-search-filters.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import { ProductEntity } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { buildPaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

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

  async findByIdWithRelations(
    id: ProductId,
  ): Promise<ProductWithRelations | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { id: id.getValue() },
      relations: ['brand', 'category', 'level', 'finish'],
    });
    if (!entity) return null;
    return this.mapEntityToProductWithRelations(entity);
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

  async findPaginated(
    filters: ProductSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>> {
    const qb = this.typeOrmRepository.createQueryBuilder('product');

    if (filters.search?.trim()) {
      const term = `%${filters.search.trim()}%`;
      qb.andWhere(
        '(product.name LIKE :term OR product.description LIKE :term)',
        { term },
      );
    }
    if (filters.brandIds?.length) {
      qb.andWhere('product.brandId IN (:...brandIds)', {
        brandIds: filters.brandIds,
      });
    }
    if (filters.categoryIds?.length) {
      qb.andWhere('product.categoryId IN (:...categoryIds)', {
        categoryIds: filters.categoryIds,
      });
    }

    const skip = (pagination.page - 1) * pagination.limit;
    qb.orderBy('product.name', 'ASC').skip(skip).take(pagination.limit);

    const [entities, total] = await qb.getManyAndCount();
    const items = entities.map((e) => ProductMapper.toDomain(e));
    return buildPaginatedResult(
      items,
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async findPaginatedWithRelations(
    filters: ProductSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ProductWithRelations>> {
    const qb = this.typeOrmRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.level', 'level')
      .leftJoinAndSelect('product.finish', 'finish');

    if (filters.search?.trim()) {
      const term = `%${filters.search.trim()}%`;
      qb.andWhere(
        '(product.name LIKE :term OR product.description LIKE :term)',
        { term },
      );
    }
    if (filters.brandIds?.length) {
      qb.andWhere('product.brandId IN (:...brandIds)', {
        brandIds: filters.brandIds,
      });
    }
    if (filters.categoryIds?.length) {
      qb.andWhere('product.categoryId IN (:...categoryIds)', {
        categoryIds: filters.categoryIds,
      });
    }

    const skip = (pagination.page - 1) * pagination.limit;
    qb.orderBy('product.name', 'ASC').skip(skip).take(pagination.limit);

    const [entities, total] = await qb.getManyAndCount();
    const data = entities.map((e) => this.mapEntityToProductWithRelations(e));
    return buildPaginatedResult(data, total, pagination.page, pagination.limit);
  }

  async findForSelect(): Promise<{ id: string; name: string }[]> {
    const entities = await this.typeOrmRepository.find({
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });
    return entities.map((e) => ({ id: e.id, name: e.name }));
  }

  async save(product: Product): Promise<void> {
    const productEntity = ProductMapper.toPersistence(product);
    await this.typeOrmRepository.save(productEntity);
  }

  async count(): Promise<number> {
    return this.typeOrmRepository.count();
  }

  private mapEntityToProductWithRelations(
    e: ProductEntity,
  ): ProductWithRelations {
    return {
      product: ProductMapper.toDomain(e),
      brand: e.brand
        ? { id: e.brand.id, name: e.brand.name }
        : e.brandId
          ? { id: e.brandId, name: '' }
          : undefined,
      category: e.category
        ? { id: e.category.id, name: e.category.name }
        : { id: e.categoryId, name: '' },
      level: e.level
        ? { id: e.level.id, name: e.level.name }
        : { id: e.levelId, name: '' },
      finish: e.finish
        ? { id: e.finish.id, name: e.finish.name }
        : { id: e.finishId, name: '' },
    };
  }
}

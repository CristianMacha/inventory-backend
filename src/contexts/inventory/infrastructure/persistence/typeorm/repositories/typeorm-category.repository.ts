import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '@contexts/inventory/domain/entities/category';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';

@Injectable()
export class TypeOrmCategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly typeOrmRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<Category[] | null> {
    const categories = await this.typeOrmRepository.find();
    return categories
      ? categories.map((e) => CategoryMapper.toDomain(e))
      : null;
  }

  async findById(id: CategoryId): Promise<Category | null> {
    const category = await this.typeOrmRepository.findOne({
      where: { id: id.getValue() },
    });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.typeOrmRepository.findOne({ where: { name } });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async save(category: Category): Promise<void> {
    const categoryEntity = CategoryMapper.toPersistence(category);
    await this.typeOrmRepository.save(categoryEntity);
  }
}

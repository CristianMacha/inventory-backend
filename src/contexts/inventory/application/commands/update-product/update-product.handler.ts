import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { UpdateProductCommand } from './update-product.command';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { ILevelRepository } from '@contexts/inventory/domain/repositories/level.repository';
import { IFinishRepository } from '@contexts/inventory/domain/repositories/finish.repository';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { LevelId } from '@contexts/inventory/domain/value-objects/level-id';
import { FinishId } from '@contexts/inventory/domain/value-objects/finish-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVENTORY_TOKENS.BRAND_REPOSITORY)
    private readonly brandRepository: IBrandRepository,
    @Inject(INVENTORY_TOKENS.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(INVENTORY_TOKENS.LEVEL_REPOSITORY)
    private readonly levelRepository: ILevelRepository,
    @Inject(INVENTORY_TOKENS.FINISH_REPOSITORY)
    private readonly finishRepository: IFinishRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const {
      id,
      name,
      description,
      brandId,
      categoryId,
      levelId,
      finishId,
      isActive,
      updatedBy,
    } = command;

    const product = await this.productRepository.findById(ProductId.create(id));
    if (!product) {
      throw new ResourceNotFoundException('Product', id);
    }

    if (name !== undefined) {
      const existingProduct = await this.productRepository.findByName(name);
      if (existingProduct && existingProduct.id.getValue() !== id) {
        throw new ConflictException(`Product with name ${name} already exists`);
      }
      product.updateName(name, updatedBy);
    }

    if (description !== undefined) {
      product.updateDescription(description, updatedBy);
    }

    if (brandId !== undefined) {
      if (brandId === null) {
        product.updateBrandId(null, updatedBy);
      } else {
        const brand = await this.brandRepository.findById(
          BrandId.create(brandId),
        );
        if (!brand) {
          throw new ResourceNotFoundException('Brand', brandId);
        }
        product.updateBrandId(BrandId.create(brandId), updatedBy);
      }
    }

    if (categoryId !== undefined) {
      const category = await this.categoryRepository.findById(
        CategoryId.create(categoryId),
      );
      if (!category) {
        throw new ResourceNotFoundException('Category', categoryId);
      }
      product.updateCategoryId(CategoryId.create(categoryId), updatedBy);
    }

    if (levelId !== undefined) {
      const level = await this.levelRepository.findById(
        LevelId.create(levelId),
      );
      if (!level) {
        throw new ResourceNotFoundException('Level', levelId);
      }
      product.updateLevelId(LevelId.create(levelId), updatedBy);
    }

    if (finishId !== undefined) {
      const finish = await this.finishRepository.findById(
        FinishId.create(finishId),
      );
      if (!finish) {
        throw new ResourceNotFoundException('Finish', finishId);
      }
      product.updateFinishId(FinishId.create(finishId), updatedBy);
    }

    if (isActive !== undefined) {
      product.setActive(isActive, updatedBy);
    }

    await this.productRepository.save(product);
  }
}

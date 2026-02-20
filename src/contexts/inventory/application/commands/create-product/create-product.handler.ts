import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ConflictException, Inject } from '@nestjs/common';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IBrandRepository } from '@contexts/inventory/domain/repositories/brand.repository';
import { ICategoryRepository } from '@contexts/inventory/domain/repositories/category.repository';
import { ILevelRepository } from '@contexts/inventory/domain/repositories/level.repository';
import { IFinishRepository } from '@contexts/inventory/domain/repositories/finish.repository';
import { Product } from '@contexts/inventory/domain/entities/product';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { LevelId } from '@contexts/inventory/domain/value-objects/level-id';
import { FinishId } from '@contexts/inventory/domain/value-objects/finish-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
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
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const {
      name,
      description,
      categoryId,
      levelId,
      finishId,
      brandId,
      createdBy,
    } = command;

    const existingProduct = await this.productRepository.findByName(name);
    if (existingProduct) {
      throw new ConflictException(`Product with name ${name} already exists`);
    }

    const category = await this.categoryRepository.findById(
      CategoryId.create(categoryId),
    );
    if (!category) {
      throw new ResourceNotFoundException('Category', categoryId);
    }

    const level = await this.levelRepository.findById(LevelId.create(levelId));
    if (!level) {
      throw new ResourceNotFoundException('Level', levelId);
    }

    const finish = await this.finishRepository.findById(
      FinishId.create(finishId),
    );
    if (!finish) {
      throw new ResourceNotFoundException('Finish', finishId);
    }

    let brandIdVO: BrandId | null = null;
    if (brandId) {
      const brand = await this.brandRepository.findById(
        BrandId.create(brandId),
      );
      if (!brand) {
        throw new ResourceNotFoundException('Brand', brandId);
      }
      brandIdVO = BrandId.create(brandId);
    }

    const product = Product.create(
      name,
      description ?? '',
      CategoryId.create(categoryId),
      LevelId.create(levelId),
      FinishId.create(finishId),
      createdBy,
      brandIdVO,
    );

    await this.productRepository.save(product);
    this.eventBus.publishAll(product.getUncommittedEvents());
    product.commit();
  }
}

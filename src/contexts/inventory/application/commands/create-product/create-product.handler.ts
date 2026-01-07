import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProductCommand } from "./create-product.comand";
import { ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { IProductRepository } from "@contexts/inventory/domain/repositories/product.repository";
import { IBrandRepository } from "@contexts/inventory/domain/repositories/brand.repository";
import { ICategoryRepository } from "@contexts/inventory/domain/repositories/category.repository";
import { Product } from "@contexts/inventory/domain/entities/product";
import { BrandId } from "@contexts/inventory/domain/value-objects/brand-id";
import { CategoryId } from "@contexts/inventory/domain/value-objects/category-id";

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('BrandRepository')
    private readonly brandRepository: IBrandRepository,
    @Inject('CategoryRepository')
    private readonly categoryRepository: ICategoryRepository,

  ) { }

  async execute(command: CreateProductCommand): Promise<void> {
    const { name, description, brandId, categoryId, createdBy } = command;

    const existingProduct = await this.productRepository.findByName(name);
    if (existingProduct) {
      throw new ConflictException(`Product with name ${name} already exists`);
    }

    const brand = await this.brandRepository.findById(brandId);
    if (!brand) {
      throw new NotFoundException(`Brand with id ${brandId} not found`);
    }

    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    const product = Product.create(name, description || '', BrandId.create(brandId), CategoryId.create(categoryId), 0, createdBy);
    await this.productRepository.save(product);
  }
}
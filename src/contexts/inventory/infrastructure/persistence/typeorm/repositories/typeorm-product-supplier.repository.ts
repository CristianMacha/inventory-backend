import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IProductSupplierRepository } from '@contexts/inventory/domain/repositories/product-supplier.repository';
import { ProductSupplier } from '@contexts/inventory/domain/entities/product-supplier';
import { ProductSupplierId } from '@contexts/inventory/domain/value-objects/product-supplier-id';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { SupplierId } from '@contexts/inventory/domain/value-objects/supplier-id';
import { ProductSupplierEntity } from '../entities/product-supplier.entity';

@Injectable()
export class TypeOrmProductSupplierRepository implements IProductSupplierRepository {
  constructor(
    @InjectRepository(ProductSupplierEntity)
    private readonly repository: Repository<ProductSupplierEntity>,
  ) {}

  async findByProductId(productId: ProductId): Promise<ProductSupplier[]> {
    const entities = await this.repository.find({
      where: { productId: productId.getValue() },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findBySupplierId(supplierId: SupplierId): Promise<ProductSupplier[]> {
    const entities = await this.repository.find({
      where: { supplierId: supplierId.getValue() },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findByProductIdAndSupplierId(
    productId: ProductId,
    supplierId: SupplierId,
  ): Promise<ProductSupplier | null> {
    const entity = await this.repository.findOne({
      where: {
        productId: productId.getValue(),
        supplierId: supplierId.getValue(),
      },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: ProductSupplierId): Promise<ProductSupplier | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async save(productSupplier: ProductSupplier): Promise<void> {
    const entity = new ProductSupplierEntity();
    entity.id = productSupplier.id.getValue();
    entity.productId = productSupplier.productId.getValue();
    entity.supplierId = productSupplier.supplierId.getValue();
    entity.isPrimary = productSupplier.isPrimary;
    await this.repository.save(entity);
  }

  async delete(id: ProductSupplierId): Promise<void> {
    await this.repository.delete({ id: id.getValue() });
  }

  private toDomain(entity: ProductSupplierEntity): ProductSupplier {
    return ProductSupplier.reconstitute(
      ProductSupplierId.create(entity.id),
      ProductId.create(entity.productId),
      SupplierId.create(entity.supplierId),
      entity.isPrimary,
    );
  }
}

import { ProductMapper } from './product.mapper';
import { Product } from '@contexts/inventory/domain/entities/product';
import { ProductEntity } from '../entities/product.entity';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { LevelId } from '@contexts/inventory/domain/value-objects/level-id';
import { FinishId } from '@contexts/inventory/domain/value-objects/finish-id';

describe('ProductMapper', () => {
  const now = new Date('2024-01-01T00:00:00Z');
  const productId = ProductId.generate();
  const brandId = BrandId.generate();
  const categoryId = CategoryId.generate();
  const levelId = LevelId.generate();
  const finishId = FinishId.generate();

  describe('toDomain', () => {
    it('should map ProductEntity to Product domain', () => {
      const entity = new ProductEntity();
      entity.id = productId.getValue();
      entity.name = 'Calacatta Gold';
      entity.description = 'Premium marble';
      entity.isActive = true;
      entity.brandId = brandId.getValue();
      entity.categoryId = categoryId.getValue();
      entity.levelId = levelId.getValue();
      entity.finishId = finishId.getValue();
      entity.createdBy = 'user-1';
      entity.updatedBy = 'user-1';
      entity.createdAt = now;
      entity.updatedAt = now;

      const domain = ProductMapper.toDomain(entity);

      expect(domain).toBeInstanceOf(Product);
      expect(domain.id.getValue()).toBe(entity.id);
      expect(domain.name).toBe(entity.name);
      expect(domain.description).toBe(entity.description);
      expect(domain.isActive).toBe(true);
      expect(domain.brandId!.getValue()).toBe(entity.brandId);
      expect(domain.categoryId.getValue()).toBe(entity.categoryId);
      expect(domain.levelId.getValue()).toBe(entity.levelId);
      expect(domain.finishId.getValue()).toBe(entity.finishId);
    });

    it('should map ProductEntity with null brandId', () => {
      const entity = new ProductEntity();
      entity.id = productId.getValue();
      entity.name = 'No Brand Product';
      entity.description = '';
      entity.isActive = true;
      entity.brandId = null;
      entity.categoryId = categoryId.getValue();
      entity.levelId = levelId.getValue();
      entity.finishId = finishId.getValue();
      entity.createdBy = 'user-1';
      entity.updatedBy = 'user-1';
      entity.createdAt = now;
      entity.updatedAt = now;

      const domain = ProductMapper.toDomain(entity);
      expect(domain.brandId).toBeNull();
    });
  });

  describe('toPersistence', () => {
    it('should map Product domain to ProductEntity', () => {
      const domain = Product.reconstitute(
        productId,
        'Calacatta Gold',
        'Premium marble',
        true,
        false,
        categoryId,
        levelId,
        finishId,
        brandId,
        'user-1',
        'user-1',
        now,
        now,
      );

      const entity = ProductMapper.toPersistence(domain);

      expect(entity).toBeInstanceOf(ProductEntity);
      expect(entity.id).toBe(productId.getValue());
      expect(entity.name).toBe('Calacatta Gold');
      expect(entity.isActive).toBe(true);
      expect(entity.brandId).toBe(brandId.getValue());
      expect(entity.categoryId).toBe(categoryId.getValue());
      expect(entity.levelId).toBe(levelId.getValue());
      expect(entity.finishId).toBe(finishId.getValue());
    });

    it('should map Product with null brandId to persistence', () => {
      const domain = Product.reconstitute(
        productId,
        'No Brand',
        '',
        true,
        false,
        categoryId,
        levelId,
        finishId,
        null,
        'user-1',
        'user-1',
        now,
        now,
      );

      const entity = ProductMapper.toPersistence(domain);
      expect(entity.brandId).toBeNull();
    });
  });
});

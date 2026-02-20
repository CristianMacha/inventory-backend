import { Product } from './product';
import { BrandId } from '../value-objects/brand-id';
import { CategoryId } from '../value-objects/category-id';
import { LevelId } from '../value-objects/level-id';
import { FinishId } from '../value-objects/finish-id';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';
import { ProductCreatedEvent } from '../events/product-created.event';

describe('Product', () => {
  const validBrandId = BrandId.generate();
  const validCategoryId = CategoryId.generate();
  const validLevelId = LevelId.generate();
  const validFinishId = FinishId.generate();
  const createdBy = 'user-1';

  describe('create', () => {
    it('should create a product with valid data', () => {
      const product = Product.create(
        'Calacatta Gold',
        'Premium white marble',
        validCategoryId,
        validLevelId,
        validFinishId,
        createdBy,
        validBrandId,
      );

      expect(product.name).toBe('Calacatta Gold');
      expect(product.description).toBe('Premium white marble');
      expect(product.brandId).toBe(validBrandId);
      expect(product.isActive).toBe(true);
      expect(product.createdBy).toBe(createdBy);
      expect(product.id).toBeDefined();
    });

    it('should create a product without brand (nullable)', () => {
      const product = Product.create(
        'Calacatta Gold',
        '',
        validCategoryId,
        validLevelId,
        validFinishId,
        createdBy,
      );

      expect(product.brandId).toBeNull();
    });

    it('should apply ProductCreatedEvent on creation', () => {
      const product = Product.create(
        'Calacatta Gold',
        '',
        validCategoryId,
        validLevelId,
        validFinishId,
        createdBy,
      );
      const events = product.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ProductCreatedEvent);
    });

    it('should throw InvalidEntityNameException when name is empty', () => {
      expect(() =>
        Product.create(
          '',
          '',
          validCategoryId,
          validLevelId,
          validFinishId,
          createdBy,
        ),
      ).toThrow(InvalidEntityNameException);
    });

    it('should throw InvalidEntityNameException when name is whitespace', () => {
      expect(() =>
        Product.create(
          '   ',
          '',
          validCategoryId,
          validLevelId,
          validFinishId,
          createdBy,
        ),
      ).toThrow(InvalidEntityNameException);
    });
  });

  describe('updateName', () => {
    it('should update name with valid value', () => {
      const product = Product.create(
        'Calacatta Gold',
        '',
        validCategoryId,
        validLevelId,
        validFinishId,
        createdBy,
      );
      product.updateName('Statuario', 'updater');

      expect(product.name).toBe('Statuario');
      expect(product.updatedBy).toBe('updater');
    });

    it('should throw InvalidEntityNameException when new name is empty', () => {
      const product = Product.create(
        'Calacatta Gold',
        '',
        validCategoryId,
        validLevelId,
        validFinishId,
        createdBy,
      );

      expect(() => product.updateName('', 'updater')).toThrow(
        InvalidEntityNameException,
      );
    });
  });

  describe('updateBrandId', () => {
    it('should update brandId to a new value', () => {
      const product = Product.create(
        'Calacatta Gold',
        '',
        validCategoryId,
        validLevelId,
        validFinishId,
        createdBy,
      );
      const newBrandId = BrandId.generate();
      product.updateBrandId(newBrandId, 'updater');

      expect(product.brandId).toBe(newBrandId);
    });

    it('should clear brandId when set to null', () => {
      const product = Product.create(
        'Calacatta Gold',
        '',
        validCategoryId,
        validLevelId,
        validFinishId,
        createdBy,
        validBrandId,
      );
      product.updateBrandId(null, 'updater');

      expect(product.brandId).toBeNull();
    });
  });

  describe('setActive', () => {
    it('should toggle isActive', () => {
      const product = Product.create(
        'Calacatta Gold',
        '',
        validCategoryId,
        validLevelId,
        validFinishId,
        createdBy,
      );
      product.setActive(false, 'updater');
      expect(product.isActive).toBe(false);
    });
  });
});

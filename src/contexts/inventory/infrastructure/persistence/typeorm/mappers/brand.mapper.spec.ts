import { BrandMapper } from './brand.mapper';
import { Brand } from '@contexts/inventory/domain/entities/brand';
import { BrandEntity } from '../entities/brand.entity';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';

describe('BrandMapper', () => {
  const now = new Date('2024-01-01T00:00:00Z');
  const brandId = BrandId.generate();

  describe('toDomain', () => {
    it('should map BrandEntity to Brand domain', () => {
      const entity = new BrandEntity();
      entity.id = brandId.getValue();
      entity.name = 'Test Brand';
      entity.description = 'A brand';
      entity.isActive = true;
      entity.createdBy = 'user-1';
      entity.updatedBy = 'user-2';
      entity.createdAt = now;
      entity.updatedAt = now;

      const domain = BrandMapper.toDomain(entity);

      expect(domain).toBeInstanceOf(Brand);
      expect(domain.id.getValue()).toBe(entity.id);
      expect(domain.name).toBe(entity.name);
      expect(domain.description).toBe(entity.description);
      expect(domain.isActive).toBe(true);
      expect(domain.createdBy).toBe(entity.createdBy);
      expect(domain.updatedBy).toBe(entity.updatedBy);
    });
  });

  describe('toPersistence', () => {
    it('should map Brand domain to BrandEntity', () => {
      const domain = Brand.reconstitute(
        brandId,
        'Test Brand',
        'A brand',
        true,
        'user-1',
        'user-2',
        now,
        now,
      );

      const entity = BrandMapper.toPersistence(domain);

      expect(entity).toBeInstanceOf(BrandEntity);
      expect(entity.id).toBe(brandId.getValue());
      expect(entity.name).toBe('Test Brand');
      expect(entity.description).toBe('A brand');
      expect(entity.isActive).toBe(true);
      expect(entity.createdBy).toBe('user-1');
      expect(entity.updatedBy).toBe('user-2');
    });
  });

  describe('roundtrip', () => {
    it('should preserve data through toDomain → toPersistence', () => {
      const entity = new BrandEntity();
      entity.id = brandId.getValue();
      entity.name = 'Test Brand';
      entity.description = 'A brand';
      entity.isActive = true;
      entity.createdBy = 'user-1';
      entity.updatedBy = 'user-1';
      entity.createdAt = now;
      entity.updatedAt = now;

      const domain = BrandMapper.toDomain(entity);
      const result = BrandMapper.toPersistence(domain);

      expect(result.id).toBe(entity.id);
      expect(result.name).toBe(entity.name);
      expect(result.description).toBe(entity.description);
      expect(result.isActive).toBe(entity.isActive);
    });
  });
});

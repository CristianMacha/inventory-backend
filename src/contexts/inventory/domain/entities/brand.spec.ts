import { Brand } from './brand';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';

describe('Brand', () => {
  const createdBy = 'user-1';

  describe('create', () => {
    it('should create a brand with valid data', () => {
      const brand = Brand.create('Test Brand', 'desc', createdBy);

      expect(brand.name).toBe('Test Brand');
      expect(brand.description).toBe('desc');
      expect(brand.isActive).toBe(true);
      expect(brand.createdBy).toBe(createdBy);
      expect(brand.id).toBeDefined();
    });

    it('should throw InvalidEntityNameException when name is empty', () => {
      expect(() => Brand.create('', 'desc', createdBy)).toThrow(
        InvalidEntityNameException,
      );
    });

    it('should throw InvalidEntityNameException when name is whitespace', () => {
      expect(() => Brand.create('   ', 'desc', createdBy)).toThrow(
        InvalidEntityNameException,
      );
    });
  });

  describe('updateName', () => {
    it('should update name with valid value', () => {
      const brand = Brand.create('Test Brand', 'desc', createdBy);
      brand.updateName('New Name', 'updater');

      expect(brand.name).toBe('New Name');
      expect(brand.updatedBy).toBe('updater');
    });

    it('should throw InvalidEntityNameException when new name is empty', () => {
      const brand = Brand.create('Test Brand', 'desc', createdBy);
      expect(() => brand.updateName('', 'updater')).toThrow(
        InvalidEntityNameException,
      );
    });
  });

  describe('setActive', () => {
    it('should deactivate a brand', () => {
      const brand = Brand.create('Test Brand', 'desc', createdBy);
      brand.setActive(false, 'admin');
      expect(brand.isActive).toBe(false);
    });
  });
});

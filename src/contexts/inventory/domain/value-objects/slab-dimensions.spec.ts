import { SlabDimensions } from './slab-dimensions';
import { InvalidSlabDimensionsException } from '../errors/invalid-slab-dimensions.exception';

describe('SlabDimensions', () => {
  describe('constructor', () => {
    it('should create valid dimensions', () => {
      const dimensions = new SlabDimensions(120.5, 240.0);

      expect(dimensions.width).toBe(120.5);
      expect(dimensions.height).toBe(240.0);
    });

    it('should throw InvalidSlabDimensionsException when width is zero', () => {
      expect(() => new SlabDimensions(0, 240.0)).toThrow(
        InvalidSlabDimensionsException,
      );
    });

    it('should throw InvalidSlabDimensionsException when width is negative', () => {
      expect(() => new SlabDimensions(-1, 240.0)).toThrow(
        InvalidSlabDimensionsException,
      );
    });

    it('should throw InvalidSlabDimensionsException when height is zero', () => {
      expect(() => new SlabDimensions(120.0, 0)).toThrow(
        InvalidSlabDimensionsException,
      );
    });
  });

  describe('toString', () => {
    it('should return formatted string', () => {
      const dimensions = new SlabDimensions(120, 240);
      expect(dimensions.toString()).toBe('120x240');
    });
  });

  describe('equals', () => {
    it('should return true for equal dimensions', () => {
      const a = new SlabDimensions(120, 240);
      const b = new SlabDimensions(120, 240);
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different dimensions', () => {
      const a = new SlabDimensions(120, 240);
      const b = new SlabDimensions(100, 240);
      expect(a.equals(b)).toBe(false);
    });
  });
});

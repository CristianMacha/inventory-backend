import { InvalidSlabDimensionsException } from '../errors/invalid-slab-dimensions.exception';

export class SlabDimensions {
  public readonly width: number;
  public readonly height: number;

  constructor(width: number, height: number) {
    this.ensureIsValidDimension(width, 'Width');
    this.ensureIsValidDimension(height, 'Height');

    this.width = width;
    this.height = height;
  }

  private ensureIsValidDimension(value: number, field: string) {
    if (value <= 0) {
      throw new InvalidSlabDimensionsException(field);
    }
  }

  public toString(): string {
    return `${this.width}x${this.height}`;
  }

  public equals(other: SlabDimensions): boolean {
    return this.width === other.width && this.height === other.height;
  }
}

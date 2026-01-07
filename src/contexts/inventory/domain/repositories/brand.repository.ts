import { Brand } from '@contexts/inventory/domain/entities/brand';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';

export interface IBrandRepository {
  findAll(): Promise<Brand[] | null>;
  findById(id: BrandId): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  save(brand: Brand): Promise<void>;
}
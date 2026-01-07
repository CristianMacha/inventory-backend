import { Brand } from '@contexts/inventory/domain/entities/brand';
import { IBrandOutputDto } from '@contexts/inventory/application/dtos/brand-output.dto';

export class BrandResponseMapper {
  public static toResponse(brand: Brand): IBrandOutputDto {
    return {
      id: brand.id.getValue(),
      name: brand.name,
      description: brand.description,
      createdBy: brand.createdBy,
      updatedBy: brand.updatedBy,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
    };
  }
}

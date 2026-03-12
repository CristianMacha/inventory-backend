import { Material } from '../../domain/entities/material.entity';
import { MaterialDto } from '../dtos/material.dto';

export class MaterialMapper {
  static toDto(material: Material, currentStock = 0): MaterialDto {
    return {
      id: material.id.getValue(),
      name: material.name,
      description: material.description,
      unit: material.unit,
      currentStock,
      minStock: material.minStock,
      unitPrice: material.unitPrice,
      categoryId: material.categoryId,
      supplierId: material.supplierId,
      imagePublicId: material.imagePublicId,
      createdBy: material.createdBy,
      updatedBy: material.updatedBy,
      createdAt: material.createdAt.toISOString(),
      updatedAt: material.updatedAt.toISOString(),
    };
  }
}

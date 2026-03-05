import { Slab } from '@contexts/inventory/domain/entities/slab';
import { ISlabOutputDto } from '@contexts/inventory/application/dtos/slab-output.dto';

export class SlabResponseMapper {
  public static toResponse(slab: Slab): ISlabOutputDto {
    return {
      id: slab.id.getValue(),
      bundleId: slab.bundleId.getValue(),
      code: slab.code,
      widthCm: slab.dimensions.width,
      heightCm: slab.dimensions.height,
      dimensions: slab.dimensions.toString(),
      status: slab.status,
      description: slab.description,
      parentSlabId: slab.parentSlabId,
      createdBy: slab.createdBy,
      updatedBy: slab.updatedBy,
      createdAt: slab.createdAt.toISOString(),
      updatedAt: slab.updatedAt.toISOString(),
    };
  }
}

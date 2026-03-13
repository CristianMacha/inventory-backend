import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMaterialStockQuery } from './get-material-stock.query';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetMaterialStockQuery)
export class GetMaterialStockHandler implements IQueryHandler<GetMaterialStockQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMaterialMovementRepository,
  ) {}

  async execute(
    query: GetMaterialStockQuery,
  ): Promise<{ currentStock: number }> {
    const material = await this.materialRepository.findById(
      MaterialId.create(query.materialId),
    );
    if (!material)
      throw new ResourceNotFoundException('Material', query.materialId);

    const currentStock = await this.movementRepository.getStockForMaterial(
      query.materialId,
    );
    return { currentStock };
  }
}

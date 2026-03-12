import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMaterialMovementsQuery } from './get-material-movements.query';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { MaterialMovementDto } from '../../dtos/material-movement.dto';
import { MaterialMovementMapper } from '../../mappers/material-movement.mapper';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetMaterialMovementsQuery)
export class GetMaterialMovementsHandler implements IQueryHandler<GetMaterialMovementsQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMaterialMovementRepository,
  ) {}

  async execute(query: GetMaterialMovementsQuery): Promise<PaginatedResult<MaterialMovementDto>> {
    const material = await this.materialRepository.findById(MaterialId.create(query.materialId));
    if (!material) throw new ResourceNotFoundException('Material', query.materialId);

    const result = await this.movementRepository.findByMaterial(query.materialId, query.pagination);
    return { ...result, data: result.data.map(MaterialMovementMapper.toDto) };
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMaterialsQuery } from './get-materials.query';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { MaterialDto } from '../../dtos/material.dto';
import { MaterialMapper } from '../../mappers/material.mapper';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetMaterialsQuery)
export class GetMaterialsHandler implements IQueryHandler<GetMaterialsQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMaterialMovementRepository,
  ) {}

  async execute(query: GetMaterialsQuery): Promise<PaginatedResult<MaterialDto>> {
    const result = await this.materialRepository.findAll(query.pagination);
    const dtos = await Promise.all(
      result.data.map(async (material) => {
        const currentStock = await this.movementRepository.getStockForMaterial(material.id.getValue());
        return MaterialMapper.toDto(material, currentStock);
      }),
    );
    return { ...result, data: dtos };
  }
}

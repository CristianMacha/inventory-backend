import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMaterialByIdQuery } from './get-material-by-id.query';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { MaterialDto } from '../../dtos/material.dto';
import { MaterialMapper } from '../../mappers/material.mapper';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetMaterialByIdQuery)
export class GetMaterialByIdHandler implements IQueryHandler<GetMaterialByIdQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMaterialMovementRepository,
  ) {}

  async execute(query: GetMaterialByIdQuery): Promise<MaterialDto> {
    const material = await this.materialRepository.findById(
      MaterialId.create(query.id),
    );
    if (!material) throw new ResourceNotFoundException('Material', query.id);
    const currentStock = await this.movementRepository.getStockForMaterial(
      query.id,
    );
    return MaterialMapper.toDto(material, currentStock);
  }
}

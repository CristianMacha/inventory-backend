import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMaterialsSelectQuery } from './get-materials-select.query';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { MaterialSelectDto } from '../../dtos/material-select.dto';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetMaterialsSelectQuery)
export class GetMaterialsSelectHandler implements IQueryHandler<GetMaterialsSelectQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
  ) {}

  async execute(query: GetMaterialsSelectQuery): Promise<MaterialSelectDto[]> {
    return this.materialRepository.findForSelect(query.search);
  }
}

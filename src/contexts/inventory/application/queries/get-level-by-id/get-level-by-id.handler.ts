import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetLevelByIdQuery } from './get-level-by-id.query';
import { ILevelRepository } from '@contexts/inventory/domain/repositories/level.repository';
import { ILevelOutputDto } from '@contexts/inventory/application/dtos/level-output.dto';
import { LevelResponseMapper } from '@contexts/inventory/application/mappers/level-response.mapper';
import { LevelId } from '@contexts/inventory/domain/value-objects/level-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetLevelByIdQuery)
export class GetLevelByIdHandler implements IQueryHandler<GetLevelByIdQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.LEVEL_REPOSITORY)
    private readonly levelRepository: ILevelRepository,
  ) {}

  async execute(query: GetLevelByIdQuery): Promise<ILevelOutputDto> {
    const level = await this.levelRepository.findById(LevelId.create(query.id));
    if (!level) {
      throw new ResourceNotFoundException('Level', query.id);
    }
    return LevelResponseMapper.toResponse(level);
  }
}

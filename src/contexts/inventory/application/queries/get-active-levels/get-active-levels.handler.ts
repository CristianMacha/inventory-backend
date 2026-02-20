import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetActiveLevelsQuery } from './get-active-levels.query';
import { ILevelRepository } from '../../../domain/repositories/level.repository';
import { ILevelOutputDto } from '../../dtos/level-output.dto';
import { LevelResponseMapper } from '../../mappers/level-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetActiveLevelsQuery)
export class GetActiveLevelsHandler implements IQueryHandler<GetActiveLevelsQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.LEVEL_REPOSITORY)
    private readonly levelRepository: ILevelRepository,
  ) {}

  async execute(_query: GetActiveLevelsQuery): Promise<ILevelOutputDto[]> {
    const levels = await this.levelRepository.findAllActive();
    return levels.map((l) => LevelResponseMapper.toResponse(l));
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetLevelsQuery } from './get-levels.query';
import { ILevelRepository } from '../../../domain/repositories/level.repository';
import { ILevelOutputDto } from '../../dtos/level-output.dto';
import { LevelResponseMapper } from '../../mappers/level-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetLevelsQuery)
export class GetLevelsHandler implements IQueryHandler<GetLevelsQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.LEVEL_REPOSITORY)
    private readonly levelRepository: ILevelRepository,
  ) {}

  async execute(): Promise<ILevelOutputDto[]> {
    const levels = await this.levelRepository.findAll();
    return (levels ?? []).map((level) => LevelResponseMapper.toResponse(level));
  }
}

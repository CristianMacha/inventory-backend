import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetToolMovementsQuery } from './get-tool-movements.query';
import { IToolMovementRepository } from '../../../domain/repositories/itool-movement.repository';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { ToolMovementDto } from '../../dtos/tool-movement.dto';
import { ToolMovementMapper } from '../../mappers/tool-movement.mapper';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetToolMovementsQuery)
export class GetToolMovementsHandler implements IQueryHandler<GetToolMovementsQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
    @Inject(WORKSHOP_TOKENS.TOOL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IToolMovementRepository,
  ) {}

  async execute(query: GetToolMovementsQuery): Promise<PaginatedResult<ToolMovementDto>> {
    const tool = await this.toolRepository.findById(ToolId.create(query.toolId));
    if (!tool) throw new ResourceNotFoundException('Tool', query.toolId);

    const result = await this.movementRepository.findByTool(query.toolId, query.pagination);
    return { ...result, data: result.data.map(ToolMovementMapper.toDto) };
  }
}

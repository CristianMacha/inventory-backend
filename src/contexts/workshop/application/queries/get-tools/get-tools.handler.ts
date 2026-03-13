import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetToolsQuery } from './get-tools.query';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { ToolDto } from '../../dtos/tool.dto';
import { ToolMapper } from '../../mappers/tool.mapper';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetToolsQuery)
export class GetToolsHandler implements IQueryHandler<GetToolsQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
  ) {}

  async execute(query: GetToolsQuery): Promise<PaginatedResult<ToolDto>> {
    const result = await this.toolRepository.findAll(query.pagination);
    return {
      ...result,
      data: result.data.map((e) => ToolMapper.toDto(e)),
    };
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetToolsSelectQuery } from './get-tools-select.query';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { ToolSelectDto } from '../../dtos/tool-select.dto';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetToolsSelectQuery)
export class GetToolsSelectHandler implements IQueryHandler<GetToolsSelectQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
  ) {}

  async execute(query: GetToolsSelectQuery): Promise<ToolSelectDto[]> {
    return this.toolRepository.findForSelect(query.search);
  }
}

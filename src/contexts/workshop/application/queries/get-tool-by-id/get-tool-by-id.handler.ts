import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetToolByIdQuery } from './get-tool-by-id.query';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { ToolDto } from '../../dtos/tool.dto';
import { ToolMapper } from '../../mappers/tool.mapper';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetToolByIdQuery)
export class GetToolByIdHandler implements IQueryHandler<GetToolByIdQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
  ) {}

  async execute(query: GetToolByIdQuery): Promise<ToolDto> {
    const tool = await this.toolRepository.findById(ToolId.create(query.id));
    if (!tool) throw new ResourceNotFoundException('Tool', query.id);
    return ToolMapper.toDto(tool);
  }
}

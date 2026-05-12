import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetWorkshopRequestsQuery } from './get-workshop-requests.query';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { UserId } from '@contexts/users/domain/value-objects/user-id';
import { MaterialId } from '../../../domain/value-objects/material-id';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { RequestType } from '../../../domain/enums/request-type.enum';
import { WorkshopRequestDto } from '../../dtos/workshop-request.dto';
import { WorkshopRequestMapper } from '../../mappers/workshop-request.mapper';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@QueryHandler(GetWorkshopRequestsQuery)
export class GetWorkshopRequestsHandler implements IQueryHandler<GetWorkshopRequestsQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.REQUEST_REPOSITORY)
    private readonly requestRepository: IWorkshopRequestRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    query: GetWorkshopRequestsQuery,
  ): Promise<PaginatedResult<WorkshopRequestDto>> {
    const result = await this.requestRepository.findAll(
      query.filter,
      query.pagination,
    );

    // Collect unique user IDs and item IDs by type
    const userIds = new Set<string>();
    const materialIds = new Set<string>();
    const toolIds = new Set<string>();

    for (const req of result.data) {
      userIds.add(req.requestedBy);
      if (req.resolvedBy) userIds.add(req.resolvedBy);
      if (req.requestType === RequestType.MATERIAL) {
        materialIds.add(req.itemId);
      } else {
        toolIds.add(req.itemId);
      }
    }

    // Batch-fetch names in parallel
    const [userNames, itemNames] = await Promise.all([
      this.resolveUserNames(userIds),
      this.resolveItemNames(materialIds, toolIds),
    ]);

    return {
      ...result,
      data: result.data.map((req) =>
        WorkshopRequestMapper.toDto(req, userNames, itemNames),
      ),
    };
  }

  private async resolveUserNames(
    userIds: Set<string>,
  ): Promise<Map<string, string>> {
    const userNames = new Map<string, string>();
    await Promise.all(
      [...userIds].map(async (id) => {
        const user = await this.userRepository.findById(UserId.create(id));
        if (user) userNames.set(id, user.name);
      }),
    );
    return userNames;
  }

  private async resolveItemNames(
    materialIds: Set<string>,
    toolIds: Set<string>,
  ): Promise<Map<string, string>> {
    const itemNames = new Map<string, string>();
    await Promise.all([
      ...[...materialIds].map(async (id) => {
        const material = await this.materialRepository.findById(
          MaterialId.create(id),
        );
        if (material) itemNames.set(id, material.name);
      }),
      ...[...toolIds].map(async (id) => {
        const tool = await this.toolRepository.findById(ToolId.create(id));
        if (tool) itemNames.set(id, tool.name);
      }),
    ]);
    return itemNames;
  }
}

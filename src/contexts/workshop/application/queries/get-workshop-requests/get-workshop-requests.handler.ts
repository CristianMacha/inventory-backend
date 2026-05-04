import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetWorkshopRequestsQuery } from './get-workshop-requests.query';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { UserId } from '@contexts/users/domain/value-objects/user-id';
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

    // Collect unique user IDs (requestedBy + resolvedBy)
    const userIds = new Set<string>();
    for (const req of result.data) {
      userIds.add(req.requestedBy);
      if (req.resolvedBy) userIds.add(req.resolvedBy);
    }

    // Batch-fetch names
    const userNames = new Map<string, string>();
    await Promise.all(
      [...userIds].map(async (id) => {
        const user = await this.userRepository.findById(UserId.create(id));
        if (user) userNames.set(id, user.name);
      }),
    );

    return {
      ...result,
      data: result.data.map((req) =>
        WorkshopRequestMapper.toDto(req, userNames),
      ),
    };
  }
}

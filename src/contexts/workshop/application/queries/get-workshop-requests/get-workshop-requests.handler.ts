import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetWorkshopRequestsQuery } from './get-workshop-requests.query';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { WorkshopRequestDto } from '../../dtos/workshop-request.dto';
import { WorkshopRequestMapper } from '../../mappers/workshop-request.mapper';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetWorkshopRequestsQuery)
export class GetWorkshopRequestsHandler implements IQueryHandler<GetWorkshopRequestsQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.REQUEST_REPOSITORY)
    private readonly requestRepository: IWorkshopRequestRepository,
  ) {}

  async execute(
    query: GetWorkshopRequestsQuery,
  ): Promise<PaginatedResult<WorkshopRequestDto>> {
    const result = await this.requestRepository.findAll(
      query.filter,
      query.pagination,
    );
    return {
      ...result,
      data: result.data.map(WorkshopRequestMapper.toDto),
    };
  }
}

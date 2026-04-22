import { FindRequestsFilter } from '../../../domain/repositories/iworkshop-request.repository';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetWorkshopRequestsQuery {
  constructor(
    public readonly filter: FindRequestsFilter,
    public readonly pagination: PaginationParams,
  ) {}
}

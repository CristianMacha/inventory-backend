import { WorkshopRequest } from '../entities/workshop-request.entity';
import { WorkshopRequestId } from '../value-objects/workshop-request-id';
import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export interface FindRequestsFilter {
  status?: RequestStatus;
  requestType?: RequestType;
  requestedBy?: string;
}

export interface IWorkshopRequestRepository {
  findAll(
    filter: FindRequestsFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<WorkshopRequest>>;
  findById(id: WorkshopRequestId): Promise<WorkshopRequest | null>;
  findApprovedMaterialRequests(): Promise<WorkshopRequest[]>;
  save(request: WorkshopRequest): Promise<void>;
}

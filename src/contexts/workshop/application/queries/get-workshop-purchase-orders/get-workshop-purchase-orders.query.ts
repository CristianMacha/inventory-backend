import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import { FindPurchaseOrdersFilter } from '../../../domain/repositories/iworkshop-purchase-order.repository';

export class GetWorkshopPurchaseOrdersQuery {
  constructor(
    public readonly filter: FindPurchaseOrdersFilter,
    public readonly pagination: PaginationParams,
  ) {}
}

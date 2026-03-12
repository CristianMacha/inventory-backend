import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetMaterialsQuery {
  constructor(public readonly pagination: PaginationParams) {}
}

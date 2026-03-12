import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetToolsQuery {
  constructor(public readonly pagination: PaginationParams) {}
}

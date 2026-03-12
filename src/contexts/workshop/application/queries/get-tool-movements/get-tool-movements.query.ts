import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetToolMovementsQuery {
  constructor(
    public readonly toolId: string,
    public readonly pagination: PaginationParams,
  ) {}
}

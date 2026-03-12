import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetMaterialMovementsQuery {
  constructor(
    public readonly materialId: string,
    public readonly pagination: PaginationParams,
  ) {}
}

/**
 * Reusable paginated result for list queries.
 * Use as response type: data, total, page, limit, totalPages.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}

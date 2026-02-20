/**
 * Reusable pagination parameters for list queries.
 * Use in query params: page (1-based), limit (items per page).
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export function normalizePaginationParams(
  page?: number,
  limit?: number,
): PaginationParams {
  const p = Math.max(1, Number(page) || DEFAULT_PAGE);
  const l = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || DEFAULT_LIMIT));
  return { page: p, limit: l };
}

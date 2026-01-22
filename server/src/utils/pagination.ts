export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export const normalizePagination = (params: PaginationParams) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize && params.pageSize > 0 && params.pageSize <= 100 ? params.pageSize : 20;
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { page, pageSize, skip, take };
};

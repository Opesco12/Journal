export type PaginationInput = {
  page: number;
  limit: number;
};

export const getPaginationArgs = ({ page, limit }: PaginationInput) => ({
  skip: (page - 1) * limit,
  take: limit,
});

export const buildPagination = ({
  page,
  limit,
  total,
}: PaginationInput & { total: number }) => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

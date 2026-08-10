import { useSearchParams } from "react-router-dom";
import type { ListParams, PostSortBy, SortOrder } from "./api";

export const useListParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const sortBy = (searchParams.get("sortBy") ?? "createdAt") as PostSortBy;
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") as SortOrder;
  const title = searchParams.get("title") ?? "";
  const params: ListParams = {
    page: Number.isNaN(page) ? 1 : page,
    limit: 12,
    sortBy,
    sortOrder,
  };

  const updateParams = (updates: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    setSearchParams(next);
  };

  return {
    params,
    setPage: (nextPage: number) => updateParams({ page: nextPage }),
    setSearch: (nextTitle: string) => updateParams({ title: nextTitle, page: 1 }),
    setSort: (sort: { sortBy: PostSortBy; sortOrder: SortOrder }) =>
      updateParams({ ...sort, page: 1 }),
    sortBy,
    sortOrder,
    title,
  };
};

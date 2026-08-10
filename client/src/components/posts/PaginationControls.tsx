import { Button } from "../ui/button";
import type { Pagination } from "../../lib/api";

type PaginationControlsProps = {
  onPageChange: (page: number) => void;
  pagination?: Pagination;
};

export const PaginationControls = ({
  onPageChange,
  pagination,
}: PaginationControlsProps) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const canGoPrevious = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-[20px] border border-border bg-white p-4 text-sm font-semibold text-muted-foreground sm:flex-row">
      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          disabled={!canGoPrevious}
          onClick={() => onPageChange(pagination.page - 1)}
          type="button"
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        <Button
          disabled={!canGoNext}
          onClick={() => onPageChange(pagination.page + 1)}
          type="button"
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

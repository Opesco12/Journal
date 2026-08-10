import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { PostSortBy, SortOrder } from "../../lib/api";

type PostToolbarProps = {
  initialSearch?: string;
  onSearch?: (term: string) => void;
  onSortChange: (sort: { sortBy: PostSortBy; sortOrder: SortOrder }) => void;
  searchPlaceholder?: string;
  sortBy: PostSortBy;
  sortOrder: SortOrder;
};

export const PostToolbar = ({
  initialSearch = "",
  onSearch,
  onSortChange,
  searchPlaceholder = "Search by title",
  sortBy,
  sortOrder,
}: PostToolbarProps) => {
  const [term, setTerm] = useState(initialSearch);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(term.trim());
  };

  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-border bg-white p-4 sm:flex-row">
      {onSearch ? (
        <form className="flex flex-1 gap-2" onSubmit={submitSearch}>
          <Input
            aria-label="Search posts"
            onChange={(event) => setTerm(event.target.value)}
            placeholder={searchPlaceholder}
            value={term}
          />
          <Button type="submit" variant="outline">
            <Search className="h-4 w-4" aria-hidden="true" />
            Search
          </Button>
        </form>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:flex">
        <select
          className="h-12 rounded-[14px] border border-input bg-white px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
          onChange={(event) =>
            onSortChange({ sortBy: event.target.value as PostSortBy, sortOrder })
          }
          value={sortBy}
        >
          <option value="createdAt">Created</option>
          <option value="updateAt">Updated</option>
          <option value="title">Title</option>
        </select>
        <select
          className="h-12 rounded-[14px] border border-input bg-white px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
          onChange={(event) =>
            onSortChange({ sortBy, sortOrder: event.target.value as SortOrder })
          }
          value={sortOrder}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
    </div>
  );
};

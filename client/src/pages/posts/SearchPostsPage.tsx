import { PostCollection } from "../../components/posts/PostCollection";
import { PostToolbar } from "../../components/posts/PostToolbar";
import { usePostSearch } from "../../lib/postHooks";
import { useListParams } from "../../lib/useListParams";

const SearchPostsPage = () => {
  const { params, setPage, setSearch, setSort, sortBy, sortOrder, title } =
    useListParams();
  const query = usePostSearch({ ...params, title }, title.trim().length > 0);

  return (
    <PostCollection
      description="Search published posts by title."
      emptyMessage="Try a different title or clear the search."
      onPageChange={setPage}
      query={query}
      title="Search posts"
      toolbar={
        <PostToolbar
          initialSearch={title}
          onSearch={setSearch}
          onSortChange={setSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      }
    />
  );
};

export default SearchPostsPage;

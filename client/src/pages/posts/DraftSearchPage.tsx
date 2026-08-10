import { PostCollection } from "../../components/posts/PostCollection";
import { PostToolbar } from "../../components/posts/PostToolbar";
import { useDraftPostSearch } from "../../lib/postHooks";
import { useListParams } from "../../lib/useListParams";

const DraftSearchPage = () => {
  const { params, setPage, setSearch, setSort, sortBy, sortOrder, title } =
    useListParams();
  const query = useDraftPostSearch({ ...params, title }, title.trim().length > 0);

  return (
    <PostCollection
      description="Search your unpublished drafts by title."
      emptyMessage="No draft matched that title."
      onPageChange={setPage}
      query={query}
      showOwnerActions
      title="Search drafts"
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

export default DraftSearchPage;

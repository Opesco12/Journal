import { PostCollection } from "../../components/posts/PostCollection";
import { PostToolbar } from "../../components/posts/PostToolbar";
import { useBookmarkedPosts } from "../../lib/postHooks";
import { useListParams } from "../../lib/useListParams";

const BookmarkedPostsPage = () => {
  const { params, setPage, setSort, sortBy, sortOrder } = useListParams();
  const query = useBookmarkedPosts(params);

  return (
    <PostCollection
      description="Saved posts for quick reading later."
      emptyMessage="Bookmark a post and it will show up here."
      onPageChange={setPage}
      query={query}
      showBookmarkRemove
      title="Bookmarks"
      toolbar={
        <PostToolbar
          onSortChange={setSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      }
    />
  );
};

export default BookmarkedPostsPage;

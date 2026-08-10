import { useParams } from "react-router-dom";
import { PostCollection } from "../../components/posts/PostCollection";
import { PostToolbar } from "../../components/posts/PostToolbar";
import { useCategoryPosts } from "../../lib/postHooks";
import { useListParams } from "../../lib/useListParams";

const CategoryPostsPage = () => {
  const { categoryId } = useParams();
  const { params, setPage, setSort, sortBy, sortOrder } = useListParams();
  const query = useCategoryPosts(categoryId, params);

  return (
    <PostCollection
      description="Published posts filtered by category."
      emptyMessage="This category does not have any published posts yet."
      onPageChange={setPage}
      query={query}
      title="Category posts"
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

export default CategoryPostsPage;

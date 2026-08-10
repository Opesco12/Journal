import { useNavigate } from "react-router-dom";
import { PostCollection } from "../../components/posts/PostCollection";
import { PostToolbar } from "../../components/posts/PostToolbar";
import { usePosts } from "../../lib/postHooks";
import { useListParams } from "../../lib/useListParams";

const PublishedPostsPage = () => {
  const navigate = useNavigate();
  const { params, setPage, setSort, sortBy, sortOrder } = useListParams();
  const query = usePosts(params);

  return (
    <PostCollection
      description="Browse every published article available to your account."
      onPageChange={setPage}
      query={query}
      title="Published posts"
      toolbar={
        <PostToolbar
          onSearch={(title) => navigate(`/posts/search?title=${encodeURIComponent(title)}`)}
          onSortChange={setSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      }
    />
  );
};

export default PublishedPostsPage;

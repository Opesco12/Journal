import { useNavigate } from "react-router-dom";
import { PostCollection } from "../../components/posts/PostCollection";
import { PostToolbar } from "../../components/posts/PostToolbar";
import { useDraftPosts } from "../../lib/postHooks";
import { useListParams } from "../../lib/useListParams";

const DraftPostsPage = () => {
  const navigate = useNavigate();
  const { params, setPage, setSort, sortBy, sortOrder } = useListParams();
  const query = useDraftPosts(params);

  return (
    <PostCollection
      description="Manage unpublished posts and move ready drafts into the published feed."
      emptyMessage="No drafts yet. Start a post and it will appear here."
      onPageChange={setPage}
      query={query}
      showOwnerActions
      title="Drafts"
      toolbar={
        <PostToolbar
          onSearch={(title) =>
            navigate(`/posts/drafts/search?title=${encodeURIComponent(title)}`)
          }
          onSortChange={setSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      }
    />
  );
};

export default DraftPostsPage;

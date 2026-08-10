import { useParams } from "react-router-dom";
import { PostCollection } from "../../components/posts/PostCollection";
import { PostToolbar } from "../../components/posts/PostToolbar";
import { useUserPosts } from "../../lib/postHooks";
import { useListParams } from "../../lib/useListParams";

const UserPostsPage = () => {
  const { userId } = useParams();
  const { params, setPage, setSort, sortBy, sortOrder } = useListParams();
  const query = useUserPosts(userId, params);

  return (
    <PostCollection
      description="All posts owned by a selected user."
      emptyMessage="This user does not have posts yet."
      onPageChange={setPage}
      query={query}
      showOwnerActions
      title="User posts"
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

export default UserPostsPage;

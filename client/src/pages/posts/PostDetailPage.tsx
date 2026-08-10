import { useEffect, useState } from "react";
import { Bookmark, Heart, Pencil, Send, Trash2, Undo2, UserRound } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "../../components/posts/EmptyState";
import { Spinner } from "../../components/common/Spinner";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import {
  useBookmarkPost,
  useDeletePost,
  useLikePost,
  usePost,
  usePublishPost,
  useRemoveBookmark,
  useUnpublishPost,
  useUnlikePost,
} from "../../lib/postHooks";

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
      }).format(new Date(value))
    : "Recently";

const PostDetailPage = () => {
  const { postId = "" } = useParams();
  const navigate = useNavigate();
  const query = usePost(postId);
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const bookmarkMutation = useBookmarkPost();
  const removeBookmarkMutation = useRemoveBookmark();
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();
  const deleteMutation = useDeletePost();
  const [pendingAction, setPendingAction] = useState<string>();

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.message);
    }
  }, [query.error]);

  const run = (
    key: string,
    mutate: (postId: string, options: { onSettled: () => void; onSuccess?: () => void }) => void,
    onSuccess?: () => void,
  ) => {
    setPendingAction(key);
    mutate(postId, {
      onSettled: () => setPendingAction(undefined),
      onSuccess,
    });
  };

  const post = query.data?.post;

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {query.isLoading ? (
          <Card className="rounded-[28px]">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ) : null}

        {query.isError ? (
          <EmptyState title="Could not load post" message="The post could not be found or your session expired." />
        ) : null}

        {post ? (
          <article className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  {post.published === false ? "Draft" : "Published"}
                </p>
                <h1 className="mt-3 text-4xl font-bold leading-tight tracking-normal text-foreground sm:text-5xl">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground">
                  <span>{formatDate(post.createdAt)}</span>
                  <Link className="inline-flex items-center gap-2 text-primary" to={`/posts/user/${post.userId}`}>
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    Author posts
                  </Link>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    {post.likesCount ?? 0}
                  </span>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link to={`/posts/${post.id}/edit`}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Link>
              </Button>
            </div>

            {post.images?.[0] ? (
              <img
                alt=""
                className="max-h-[480px] w-full rounded-[28px] border border-border object-cover"
                src={post.images[0]}
              />
            ) : null}

            <Card className="rounded-[28px]">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <p className="whitespace-pre-wrap text-lg leading-9 text-foreground">{post.body}</p>
                {post.images.length > 1 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {post.images.slice(1).map((image) => (
                      <img
                        alt=""
                        className="h-56 w-full rounded-[20px] object-cover"
                        key={image}
                        src={image}
                      />
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 rounded-[24px] border border-border bg-white p-4">
              <Button
                onClick={() => run("like", likeMutation.mutate)}
                type="button"
                variant="outline"
              >
                {pendingAction === "like" ? <Spinner /> : <Heart className="h-4 w-4" aria-hidden="true" />}
                Like
              </Button>
              <Button
                onClick={() => run("unlike", unlikeMutation.mutate)}
                type="button"
                variant="outline"
              >
                {pendingAction === "unlike" ? <Spinner /> : <Heart className="h-4 w-4" aria-hidden="true" />}
                Unlike
              </Button>
              <Button
                onClick={() => run("bookmark", bookmarkMutation.mutate)}
                type="button"
                variant="outline"
              >
                {pendingAction === "bookmark" ? <Spinner /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
                Save
              </Button>
              <Button
                onClick={() => run("remove-bookmark", removeBookmarkMutation.mutate)}
                type="button"
                variant="outline"
              >
                {pendingAction === "remove-bookmark" ? <Spinner /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
                Remove bookmark
              </Button>
              {post.published === false ? (
                <Button
                  onClick={() => run("publish", publishMutation.mutate)}
                  type="button"
                  variant="outline"
                >
                  {pendingAction === "publish" ? <Spinner /> : <Send className="h-4 w-4" aria-hidden="true" />}
                  Publish
                </Button>
              ) : (
                <Button
                  onClick={() => run("unpublish", unpublishMutation.mutate)}
                  type="button"
                  variant="outline"
                >
                  {pendingAction === "unpublish" ? <Spinner /> : <Undo2 className="h-4 w-4" aria-hidden="true" />}
                  Move to drafts
                </Button>
              )}
              <Button
                onClick={() => {
                  if (window.confirm("Delete this post?")) {
                    run("delete", deleteMutation.mutate, () => navigate("/posts"));
                  }
                }}
                type="button"
                variant="outline"
              >
                {pendingAction === "delete" ? <Spinner /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                Delete
              </Button>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
};

export default PostDetailPage;

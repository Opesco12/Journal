import { useEffect, useState, type ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { EmptyState } from "./EmptyState";
import { PaginationControls } from "./PaginationControls";
import { PostCard } from "./PostCard";
import { PostListSkeleton } from "./PostListSkeleton";
import type { PostListResponse } from "../../lib/api";
import {
  useBookmarkPost,
  useDeletePost,
  useLikePost,
  usePublishPost,
  useRemoveBookmark,
  useUnpublishPost,
  useUnlikePost,
} from "../../lib/postHooks";

type PostCollectionProps = {
  action?: ReactNode;
  description: string;
  emptyMessage?: string;
  emptyTitle?: string;
  onPageChange: (page: number) => void;
  query: UseQueryResult<PostListResponse, Error>;
  showBookmarkRemove?: boolean;
  showOwnerActions?: boolean;
  title: string;
  toolbar?: ReactNode;
};

export const PostCollection = ({
  action,
  description,
  emptyMessage = "There are no posts to show here yet.",
  emptyTitle = "No posts found",
  onPageChange,
  query,
  showBookmarkRemove,
  showOwnerActions,
  title,
  toolbar,
}: PostCollectionProps) => {
  const [pendingAction, setPendingAction] = useState<string>();
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const bookmarkMutation = useBookmarkPost();
  const removeBookmarkMutation = useRemoveBookmark();
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();
  const deleteMutation = useDeletePost();

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.message);
    }
  }, [query.error]);

  const runPostAction = (
    key: string,
    postId: string,
    actionFn: (postId: string, options: { onSettled: () => void }) => void,
  ) => {
    setPendingAction(`${key}:${postId}`);
    actionFn(postId, {
      onSettled: () => setPendingAction(undefined),
    });
  };

  const deletePost = (postId: string) => {
    if (!window.confirm("Delete this post?")) {
      return;
    }

    runPostAction("delete", postId, deleteMutation.mutate);
  };

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-normal text-foreground">{title}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{description}</p>
          </div>
          {action ?? (
            <Button asChild>
              <Link to="/posts/new">
                <Plus className="h-4 w-4" aria-hidden="true" />
                New post
              </Link>
            </Button>
          )}
        </div>

        {toolbar}

        {query.isLoading ? <PostListSkeleton /> : null}

        {query.isError ? (
          <EmptyState
            title="Could not load posts"
            message="Check your session and try again in a moment."
          />
        ) : null}

        {query.data && query.data.posts.length === 0 ? (
          <EmptyState title={emptyTitle} message={emptyMessage} href="/posts/new" action="Create post" />
        ) : null}

        {query.data && query.data.posts.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {query.data.posts.map((post) => (
              <PostCard
                key={post.id}
                onBookmark={
                  showBookmarkRemove
                    ? undefined
                    : (postId) => runPostAction("bookmark", postId, bookmarkMutation.mutate)
                }
                onDelete={showOwnerActions ? deletePost : undefined}
                onLike={(postId) => runPostAction("like", postId, likeMutation.mutate)}
                onUnlike={(postId) =>
                  runPostAction("unlike", postId, unlikeMutation.mutate)
                }
                onPublish={
                  showOwnerActions
                    ? (postId) => runPostAction("publish", postId, publishMutation.mutate)
                    : undefined
                }
                onRemoveBookmark={
                  showBookmarkRemove
                    ? (postId) =>
                        runPostAction("remove-bookmark", postId, removeBookmarkMutation.mutate)
                    : undefined
                }
                onUnpublish={
                  showOwnerActions
                    ? (postId) => runPostAction("unpublish", postId, unpublishMutation.mutate)
                    : undefined
                }
                pendingAction={pendingAction}
                post={post}
                showOwnerActions={showOwnerActions}
              />
            ))}
          </div>
        ) : null}

        <PaginationControls
          onPageChange={onPageChange}
          pagination={query.data?.pagination}
        />
      </div>
    </main>
  );
};

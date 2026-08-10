import { Bookmark, Eye, Heart, Pencil, Send, Trash2, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Spinner } from "../common/Spinner";
import { Button } from "../ui/button";
import type { Post } from "../../lib/api";
import { cn } from "../../lib/utils";

type PostCardProps = {
  post: Post;
  onBookmark?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onUnlike?: (postId: string) => void;
  onPublish?: (postId: string) => void;
  onRemoveBookmark?: (postId: string) => void;
  onUnpublish?: (postId: string) => void;
  pendingAction?: string;
  showOwnerActions?: boolean;
};

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "Recently";

export const PostCard = ({
  post,
  onBookmark,
  onDelete,
  onLike,
  onUnlike,
  onPublish,
  onRemoveBookmark,
  onUnpublish,
  pendingAction,
  showOwnerActions,
}: PostCardProps) => {
  const image = post.images?.[0];
  const isDraft = post.published === false;

  return (
    <article className="overflow-hidden rounded-[24px] border border-border bg-white shadow-sm">
      <Link
        className={cn(
          "block h-44 bg-primary-soft",
          !image && "bg-[linear-gradient(135deg,#dbeafe,#eff6ff_50%,#ffffff)]",
        )}
        to={`/posts/${post.id}`}
      >
        {image ? (
          <img alt="" className="h-full w-full object-cover" src={image} />
        ) : null}
      </Link>
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDate(post.createdAt)}</span>
          <span className="rounded-full bg-muted px-3 py-1 font-semibold text-foreground">
            {isDraft ? "Draft" : "Published"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="h-4 w-4" aria-hidden="true" />
            {post.likesCount ?? 0}
          </span>
        </div>

        <div>
          <Link to={`/posts/${post.id}`}>
            <h2 className="line-clamp-2 text-2xl font-bold leading-tight text-foreground">
              {post.title}
            </h2>
          </Link>
          <p className="mt-3 line-clamp-3 leading-7 text-muted-foreground">{post.body}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/posts/${post.id}`}>
              <Eye className="h-4 w-4" aria-hidden="true" />
              Open
            </Link>
          </Button>
          <Button onClick={() => onLike?.(post.id)} type="button" variant="outline" size="sm">
            {pendingAction === `like:${post.id}` ? <Spinner /> : <Heart className="h-4 w-4" aria-hidden="true" />}
            Like
          </Button>
          {onUnlike ? (
            <Button onClick={() => onUnlike(post.id)} type="button" variant="outline" size="sm">
              {pendingAction === `unlike:${post.id}` ? <Spinner /> : <Heart className="h-4 w-4" aria-hidden="true" />}
              Unlike
            </Button>
          ) : null}
          {onBookmark ? (
            <Button onClick={() => onBookmark(post.id)} type="button" variant="outline" size="sm">
              {pendingAction === `bookmark:${post.id}` ? <Spinner /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
              Save
            </Button>
          ) : null}
          {onRemoveBookmark ? (
            <Button onClick={() => onRemoveBookmark(post.id)} type="button" variant="outline" size="sm">
              {pendingAction === `remove-bookmark:${post.id}` ? <Spinner /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
              Remove
            </Button>
          ) : null}
          {showOwnerActions ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to={`/posts/${post.id}/edit`}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Link>
              </Button>
              {isDraft ? (
                <Button onClick={() => onPublish?.(post.id)} type="button" variant="outline" size="sm">
                  {pendingAction === `publish:${post.id}` ? <Spinner /> : <Send className="h-4 w-4" aria-hidden="true" />}
                  Publish
                </Button>
              ) : (
                <Button onClick={() => onUnpublish?.(post.id)} type="button" variant="outline" size="sm">
                  {pendingAction === `unpublish:${post.id}` ? <Spinner /> : <Undo2 className="h-4 w-4" aria-hidden="true" />}
                  Draft
                </Button>
              )}
              <Button onClick={() => onDelete?.(post.id)} type="button" variant="outline" size="sm">
                {pendingAction === `delete:${post.id}` ? <Spinner /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                Delete
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
};

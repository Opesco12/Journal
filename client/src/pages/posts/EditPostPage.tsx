import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PostForm } from "../../components/posts/PostForm";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { usePost, useUpdatePost } from "../../lib/postHooks";

const EditPostPage = () => {
  const { postId = "" } = useParams();
  const navigate = useNavigate();
  const query = usePost(postId);
  const mutation = useUpdatePost(postId);

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.message);
    }
  }, [query.error]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-normal text-foreground">Edit post</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Update the title, body, or image URLs for this post.
          </p>
        </div>
        <Card className="rounded-[28px]">
          <CardContent className="p-6 sm:p-8">
            {query.isLoading ? (
              <div className="space-y-5">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-56 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : null}
            {query.data ? (
              <PostForm
                initialPost={query.data.post}
                isSubmitting={mutation.isPending}
                onSubmit={(payload) =>
                  mutation.mutate(payload, {
                    onSuccess: () => navigate(`/posts/${postId}`),
                  })
                }
                submitLabel="Update post"
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default EditPostPage;

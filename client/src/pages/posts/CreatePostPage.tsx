import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { PostForm } from "../../components/posts/PostForm";
import { useCreatePost } from "../../lib/postHooks";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const mutation = useCreatePost();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-normal text-foreground">Create post</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            New posts are saved to drafts first. Publish when the piece is ready.
          </p>
        </div>
        <Card className="rounded-[28px]">
          <CardContent className="p-6 sm:p-8">
            <PostForm
              isSubmitting={mutation.isPending}
              onSubmit={(payload) =>
                mutation.mutate(payload, {
                  onSuccess: () => navigate(payload.published ? "/posts" : "/posts/drafts"),
                })
              }
              showPublishSwitch
              submitLabel="Save draft"
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CreatePostPage;

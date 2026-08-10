import { useFormik } from "formik";
import * as Yup from "yup";
import { Spinner } from "../common/Spinner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { CreatePostInput, Post } from "../../lib/api";

type PostFormProps = {
  initialPost?: Post;
  isSubmitting: boolean;
  onSubmit: (payload: CreatePostInput) => void;
  submitLabel: string;
};

type FormValues = {
  title: string;
  body: string;
  images: string;
};

const schema = Yup.object({
  title: Yup.string()
    .trim()
    .max(200, "Title must be under 200 characters")
    .required("Title is required"),
  body: Yup.string()
    .trim()
    .max(4000, "Post body must be under 4000 characters")
    .required("Body is required"),
  images: Yup.string(),
});

const parseImages = (value: string) =>
  value
    .split(/\n|,/)
    .map((image) => image.trim())
    .filter(Boolean);

export const PostForm = ({
  initialPost,
  isSubmitting,
  onSubmit,
  submitLabel,
}: PostFormProps) => {
  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      title: initialPost?.title ?? "",
      body: initialPost?.body ?? "",
      images: initialPost?.images?.join("\n") ?? "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      onSubmit({
        title: values.title.trim(),
        body: values.body.trim(),
        images: parseImages(values.images),
      });
    },
  });

  return (
    <form className="space-y-5" onSubmit={formik.handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          invalid={Boolean(formik.touched.title && formik.errors.title)}
          name="title"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="A practical guide to publishing consistently"
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title ? (
          <p className="text-sm font-medium text-destructive">{formik.errors.title}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          invalid={Boolean(formik.touched.body && formik.errors.body)}
          name="body"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Write the post body..."
          value={formik.values.body}
        />
        {formik.touched.body && formik.errors.body ? (
          <p className="text-sm font-medium text-destructive">{formik.errors.body}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image URLs</Label>
        <Textarea
          className="min-h-24"
          id="images"
          name="images"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="https://example.com/image.jpg"
          value={formik.values.images}
        />
        <p className="text-sm text-muted-foreground">
          Add one URL per line, or separate multiple URLs with commas.
        </p>
      </div>

      <Button className="w-full sm:w-auto" disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting ? <Spinner /> : null}
        {submitLabel}
      </Button>
    </form>
  );
};

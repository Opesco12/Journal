import { useFormik } from "formik";
import { ImagePlus, X } from "lucide-react";
import * as Yup from "yup";
import { Spinner } from "../common/Spinner";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import type { Category, CreatePostInput, Post } from "../../lib/api";

type PostFormProps = {
  categories?: Category[];
  categoriesLoading?: boolean;
  initialPost?: Post;
  isSubmitting: boolean;
  onSubmit: (payload: CreatePostInput) => void;
  showCategorySelect?: boolean;
  showPublishSwitch?: boolean;
  submitLabel: string;
};

type FormValues = {
  title: string;
  body: string;
  categoryIds: string[];
  imageFiles: File[];
  images: string;
  published: boolean;
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
  categories = [],
  categoriesLoading,
  initialPost,
  isSubmitting,
  onSubmit,
  showCategorySelect,
  showPublishSwitch,
  submitLabel,
}: PostFormProps) => {
  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      title: initialPost?.title ?? "",
      body: initialPost?.body ?? "",
      categoryIds: [],
      imageFiles: [],
      images: initialPost?.images?.join("\n") ?? "",
      published: initialPost?.published ?? false,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      onSubmit({
        title: values.title.trim(),
        body: values.body.trim(),
        imageFiles: values.imageFiles,
        images: parseImages(values.images),
        ...(showCategorySelect && { categoryIds: values.categoryIds }),
        ...(showPublishSwitch && { published: values.published }),
      });
    },
  });

  const toggleCategory = (categoryId: string) => {
    const nextCategories = formik.values.categoryIds.includes(categoryId)
      ? formik.values.categoryIds.filter((id) => id !== categoryId)
      : [...formik.values.categoryIds, categoryId];

    void formik.setFieldValue("categoryIds", nextCategories);
  };

  const removeFile = (fileIndex: number) => {
    void formik.setFieldValue(
      "imageFiles",
      formik.values.imageFiles.filter((_, index) => index !== fileIndex),
    );
  };

  return (
    <form
      className="space-y-5"
      onSubmit={formik.handleSubmit}
    >
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
          <p className="text-sm font-medium text-destructive">
            {formik.errors.title}
          </p>
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
          <p className="text-sm font-medium text-destructive">
            {formik.errors.body}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageFiles">Images from your computer</Label>
        <label
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[18px] border border-dashed border-border bg-muted/40 px-4 py-8 text-center transition-colors hover:bg-muted"
          htmlFor="imageFiles"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary-soft text-primary">
            <ImagePlus
              className="h-5 w-5"
              aria-hidden="true"
            />
          </span>
          <span className="text-sm font-semibold text-foreground">
            Choose images from your computer
          </span>
          <span className="text-sm text-muted-foreground">
            PNG, JPG, WebP, or GIF
          </span>
        </label>
        <input
          accept="image/*"
          className="sr-only"
          id="imageFiles"
          multiple
          name="imageFiles"
          onChange={(event) => {
            const files = Array.from(event.currentTarget.files ?? []);
            void formik.setFieldValue("imageFiles", files);
          }}
          type="file"
        />
        {formik.values.imageFiles.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {formik.values.imageFiles.map((file, index) => (
              <div
                className="flex items-center justify-between gap-3 rounded-[16px] border border-border bg-white p-3"
                key={`${file.name}-${file.lastModified}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(index)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            ))}
          </div>
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

      {showCategorySelect ? (
        <div className="space-y-3">
          <div>
            <Label>Categories</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Optional. Select every category this post belongs to.
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  className="h-12"
                  key={index}
                />
              ))}
            </div>
          ) : null}

          {!categoriesLoading && categories.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => {
                const checked = formik.values.categoryIds.includes(category.id);

                return (
                  <div
                    className="flex items-center gap-3 rounded-[16px] border border-border bg-white p-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    key={category.id}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <button
                      className="flex-1 text-left"
                      onClick={() => toggleCategory(category.id)}
                      type="button"
                    >
                      {category.name}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}

          {!categoriesLoading && categories.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              No categories are available yet. You can publish without choosing
              one.
            </div>
          ) : null}
        </div>
      ) : null}

      {showPublishSwitch ? (
        <div className="flex items-center justify-between gap-4 rounded-[18px] border border-border bg-muted/50 p-4">
          <div>
            <Label htmlFor="published">Publish immediately</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Turn this on to publish now, or leave it off to save as a draft.
            </p>
          </div>
          <Switch
            checked={formik.values.published}
            id="published"
            onCheckedChange={(checked) =>
              formik.setFieldValue("published", checked)
            }
          />
        </div>
      ) : null}

      <Button
        className="w-full sm:w-auto"
        disabled={isSubmitting}
        size="lg"
        type="submit"
      >
        {isSubmitting ? <Spinner /> : null}
        {showPublishSwitch && formik.values.published
          ? "Publish post"
          : submitLabel}
      </Button>
    </form>
  );
};

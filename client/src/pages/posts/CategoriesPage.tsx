import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Tags } from "lucide-react";
import { EmptyState } from "../../components/posts/EmptyState";
import { PaginationControls } from "../../components/posts/PaginationControls";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useCategories } from "../../lib/postHooks";
import { useListParams } from "../../lib/useListParams";

const CategoriesPage = () => {
  const { params, setPage } = useListParams();
  const query = useCategories({
    page: params.page,
    limit: params.limit,
    sortBy: "name",
    sortOrder: "asc",
  });

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.message);
    }
  }, [query.error]);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-normal text-foreground">Categories</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Browse published posts through the categories available from the server.
          </p>
        </div>

        {query.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-32" key={index} />
            ))}
          </div>
        ) : null}

        {query.isError ? (
          <EmptyState title="Could not load categories" message="Try again in a moment." />
        ) : null}

        {query.data && query.data.categories.length === 0 ? (
          <EmptyState title="No categories found" message="Categories will appear here once they are created." />
        ) : null}

        {query.data && query.data.categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {query.data.categories.map((category) => (
              <Card className="rounded-[22px]" key={category.id}>
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary-soft text-primary">
                      <Tags className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{category.name}</h2>
                      <p className="text-sm text-muted-foreground">Category feed</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/posts/category/${category.id}`}>Open</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        <PaginationControls
          onPageChange={setPage}
          pagination={query.data?.pagination}
        />
      </div>
    </main>
  );
};

export default CategoriesPage;

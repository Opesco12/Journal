import { Skeleton } from "../ui/skeleton";

export const PageSkeleton = () => (
  <main className="min-h-screen bg-background p-6">
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-36" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <section className="grid gap-8 py-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-5">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-16 w-full max-w-xl" />
          <Skeleton className="h-16 w-full max-w-lg" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-28" />
          </div>
        </div>
        <Skeleton className="min-h-[360px] w-full rounded-[28px]" />
      </section>
    </div>
  </main>
);

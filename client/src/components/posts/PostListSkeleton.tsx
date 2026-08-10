import { Skeleton } from "../ui/skeleton";

export const PostListSkeleton = () => (
  <div className="grid gap-5 xl:grid-cols-2">
    {Array.from({ length: 4 }).map((_, index) => (
      <div className="rounded-[24px] border border-border bg-white p-5" key={index}>
        <Skeleton className="mb-5 h-44 w-full" />
        <Skeleton className="mb-3 h-5 w-28" />
        <Skeleton className="mb-3 h-7 w-4/5" />
        <Skeleton className="mb-5 h-16 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    ))}
  </div>
);

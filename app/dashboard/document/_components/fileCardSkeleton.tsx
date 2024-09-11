import { Skeleton } from '@/components/ui/skeleton';

export function FileCardSkeleton() {
  return (
    <div className="w-[350px]">
      <div className="space-y-4">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}

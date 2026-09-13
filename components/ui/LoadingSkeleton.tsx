import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

export function LoadingSkeleton({ className, variant = 'text' }: LoadingSkeletonProps) {
  const variants = {
    text: 'h-4 w-full',
    card: 'h-48 w-full rounded-xl',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-lg',
  };
  
  return (
    <div
      className={cn(
        'skeleton animate-pulse',
        variants[variant],
        className
      )}
    />
  );
}

export function TopicCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
      <div className="flex items-start justify-between mb-2">
        <LoadingSkeleton variant="avatar" className="w-10 h-10" />
        <LoadingSkeleton variant="button" className="w-16 h-6" />
      </div>
      
      <div className="space-y-2">
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-5/6" />
      </div>
      
      <div className="space-y-2 pt-2">
        <LoadingSkeleton className="h-3 w-1/2" />
        <LoadingSkeleton className="h-3 w-2/3" />
      </div>
      
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-2">
          <LoadingSkeleton className="h-6 w-16 rounded-md" />
          <LoadingSkeleton className="h-6 w-20 rounded-md" />
          <LoadingSkeleton className="h-6 w-14 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-3 w-24" />
          <LoadingSkeleton className="h-8 w-16" />
        </div>
        <LoadingSkeleton variant="avatar" className="w-12 h-12 rounded-xl" />
      </div>
    </div>
  );
}

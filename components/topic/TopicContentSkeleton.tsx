import { Skeleton } from '@/components/ui/Skeleton';

export function TopicContentSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3 mb-8">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        {/* Level selector */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>

        {/* Content sections */}
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-4 mb-8">
            {/* Section title */}
            <Skeleton className="h-8 w-1/3" />
            
            {/* Paragraphs */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Formula or code block */}
            <Skeleton className="h-32 w-full rounded-lg" />

            {/* More paragraphs */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}

        {/* Key points */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

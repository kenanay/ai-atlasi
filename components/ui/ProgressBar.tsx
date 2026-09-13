import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };
  
  const getColor = (percent: number) => {
    if (percent >= 100) return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
    if (percent >= 75) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (percent >= 50) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    if (percent >= 25) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    return 'bg-gradient-to-r from-blue-400 to-blue-500';
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner', sizes[size])}>
        <div
          className={cn('h-full transition-all duration-700 ease-out rounded-full relative overflow-hidden', getColor(percentage))}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
      {showLabel && (
        <div className="mt-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 text-right">
          %{Math.round(percentage)}
        </div>
      )}
    </div>
  );
}

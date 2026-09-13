'use client';

import { useProgress } from '@/lib/use-progress';

import Link from 'next/link';
import { Topic } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Clock, Lock, CheckCircle, BookOpen } from 'lucide-react';
import { LEVEL_INFO, CATEGORY_INFO, formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  topic: Topic;
  isLocked?: boolean;
  showProgress?: boolean;
}

export function TopicCard({ topic, isLocked = false, showProgress = true }: TopicCardProps) {
  const allProgress = useProgress();
  const progress = allProgress.find(p => p.topicId === topic.id) ?? null;
  const categoryInfo = CATEGORY_INFO[topic.category];
  // Fallback to level 1 if topic.level is undefined
  const topicLevel = typeof topic.level === 'number' ? topic.level : 1;
  const levelInfo = LEVEL_INFO[topicLevel as keyof typeof LEVEL_INFO] || LEVEL_INFO[1];
  
  const completionPercentage = progress 
    ? Math.round((progress.completedLevels.length / 5) * 100)
    : 0;
  
  const getStatusIcon = () => {
    if (isLocked) return <Lock className="w-4 h-4 text-slate-400" />;
    if (progress?.status === 'completed') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (progress?.status === 'in_progress') return <BookOpen className="w-4 h-4 text-blue-500" />;
    return null;
  };
  
  return (
    <Link href={isLocked ? '#' : `/topic/${topic.id}`} className="block h-full">
      <Card 
        hover={!isLocked}
        className={cn(
          'h-full flex flex-col justify-between transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900',
          'animate-fade-in hover-lift',
          isLocked && 'opacity-60 cursor-not-allowed hover:shadow-none'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{categoryInfo?.icon}</span>
              {getStatusIcon()}
            </div>
            <Badge variant={topic.level >= 3 ? 'danger' : topic.level >= 2 ? 'warning' : 'primary'}>
              Seviye {topic.level}
            </Badge>
          </div>
          
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">{topic.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-slate-600 dark:text-slate-400 mt-1.5 text-xs leading-relaxed">
            {topic.content?.level0_basic || (topic.levels && topic.levels[0]?.content) || topic.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="py-2">
          <div className="space-y-2.5">
            {/* Seviye bilgisi */}
            <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
              <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', levelInfo.color)} />
              <span>{levelInfo.name} - {levelInfo.description}</span>
            </div>
            
            {/* Süre */}
            <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{formatDuration(topic.estimatedTime)}</span>
            </div>
            
            {/* Önkoşullar */}
            {topic.prerequisites.length > 0 && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Önkoşul:</span> {topic.prerequisites.length} konu
              </div>
            )}
            
            {/* İlerleme */}
            {showProgress && progress && (
              <div className="pt-2">
                <ProgressBar value={completionPercentage} showLabel size="sm" />
                {progress.timeSpent > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formatDuration(progress.timeSpent)} çalışıldı
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
          <div className="flex flex-wrap gap-1">
            {topic.tags && topic.tags.length > 0 ? (
              <>
                {topic.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
                {topic.tags.length > 3 && (
                  <span className="text-[11px] font-medium px-1.5 py-0.5 text-slate-500 dark:text-slate-400">
                    +{topic.tags.length - 3}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                Etiket yok
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

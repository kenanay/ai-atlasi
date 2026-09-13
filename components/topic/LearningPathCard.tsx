'use client';

import { useProgress } from '@/lib/use-progress';

import { Topic } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowDown, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LearningPathCardProps {
  topics: Topic[];
  title: string;
}

export function LearningPathCard({ topics, title }: LearningPathCardProps) {
  const allProgress = useProgress();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {topics.map((topic, index) => {
            const progress = allProgress.find(p => p.topicId === topic.id) ?? null;
            const isCompleted = progress?.status === 'completed';
            const isInProgress = progress?.status === 'in_progress';
            
            return (
              <div key={topic.id}>
                <Link href={`/topic/${topic.id}`} className="block group">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    {/* Status Icon */}
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : isInProgress ? (
                        <Circle className="w-4 h-4 text-blue-600 fill-blue-100 dark:text-blue-400 dark:fill-blue-950" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                    
                    {/* Topic Info */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-xs font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
                        isCompleted && 'text-slate-400 dark:text-slate-500 line-through',
                        isInProgress && 'text-blue-600 dark:text-blue-400 font-semibold',
                        !isCompleted && !isInProgress && 'text-slate-700 dark:text-slate-300'
                      )}>
                        {topic.title}
                      </p>
                    </div>
                    
                    {/* Level Badge */}
                    <Badge variant="default" className="text-[10px] px-1.5 py-0.2">
                      Lv.{topic.level}
                    </Badge>
                  </div>
                </Link>
                
                {/* Arrow */}
                {index < topics.length - 1 && (
                  <div className="ml-5 my-0.5">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

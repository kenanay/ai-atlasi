'use client';

import { TopicLevel } from '@/types';
import { LEVEL_INFO } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Lock } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: TopicLevel;
  completedLevels: TopicLevel[];
  onLevelChange: (level: TopicLevel) => void;
}

export function LevelSelector({ 
  currentLevel, 
  completedLevels, 
  onLevelChange 
}: LevelSelectorProps) {
  const levels: TopicLevel[] = [0, 1, 2, 3, 4];
  
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-1">
        Seviyeler
      </h3>
      {levels.map((level) => {
        const info = LEVEL_INFO[level];
        const isCompleted = completedLevels.includes(level);
        const isCurrent = currentLevel === level;
        const isUnlocked = level === 0 || completedLevels.includes((level - 1) as TopicLevel);
        
        return (
          <button
            key={level}
            onClick={() => isUnlocked && onLevelChange(level)}
            disabled={!isUnlocked}
            className={cn(
              'w-full text-left p-2.5 rounded-xl border transition-all duration-200 cursor-pointer',
              isCurrent && 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-400 ring-1 ring-blue-500/20 shadow-sm',
              !isCurrent && isCompleted && 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm',
              !isCurrent && !isCompleted && isUnlocked && 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm hover:scale-[1.02]',
              !isUnlocked && 'border-slate-100 dark:border-slate-800/40 bg-slate-50 dark:bg-slate-900/30 opacity-40 cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : isUnlocked ? (
                  <Circle className={cn(
                    'w-4 h-4',
                    isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                  )} />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.2 rounded',
                    info.color.replace('bg-', 'bg-opacity-15 text-')
                  )}>
                    S.{level}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {info.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {info.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

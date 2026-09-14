'use client';

import { Topic, TopicLevel, UserProgress } from '@/types';
import { LevelSelector } from './LevelSelector';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { 
  Clock, 
  BookmarkPlus, 
  BookmarkCheck, 
  CheckCircle, 
  ArrowLeft,
  Award
} from 'lucide-react';
import { formatDuration, calculateProgress } from '@/lib/utils';
import { getTopicById } from '@/lib/topics';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TopicSidebarProps {
  topic: Topic;
  currentLevel: TopicLevel;
  progress: UserProgress | null;
  onLevelChange: (level: TopicLevel) => void;
  onBookmarkToggle: () => void;
}

export function TopicSidebar({ 
  topic, 
  currentLevel, 
  progress,
  onLevelChange,
  onBookmarkToggle
}: TopicSidebarProps) {
  const completedLevels = progress?.completedLevels || [];
  const progressPercentage = calculateProgress(completedLevels);
  
  return (
    <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 transition-colors">
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <Link href="/topics">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Konulara Dön
          </Button>
        </Link>

        {/* Topic Info */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between mb-2">
              <Badge variant={topic.level >= 3 ? 'danger' : 'primary'}>
                Seviye {topic.level}
              </Badge>
              <button
                onClick={onBookmarkToggle}
                className="text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer p-1"
                title={progress?.bookmarked ? 'Yer işaretini kaldır' : 'Yer işaretlerine ekle'}
              >
                {progress?.bookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                ) : (
                  <BookmarkPlus className="w-5 h-5" />
                )}
              </button>
            </div>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">{topic.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{formatDuration(topic.estimatedTime)}</span>
            </div>
            
            {progress && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">İlerleme</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">%{progressPercentage}</span>
                </div>
                <ProgressBar value={progressPercentage} size="sm" />
                {progress.status === 'completed' && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Konu Tamamlandı!</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Level Selector */}
        <Card>
          <CardContent className="p-3">
            <LevelSelector
              currentLevel={currentLevel}
              completedLevels={completedLevels}
              onLevelChange={onLevelChange}
            />
          </CardContent>
        </Card>

        {/* Prerequisites */}
        {topic.prerequisites && topic.prerequisites.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Önkoşullar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {topic.prerequisites.map((prereqId) => {
                const prereq = getTopicById(prereqId);
                if (!prereq) return null;
                
                return (
                  <Link key={prereqId} href={`/topic/${prereqId}`}>
                    <div className={cn(
                      'p-2 rounded-lg border text-xs font-medium transition-colors',
                      'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300',
                      'hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-300'
                    )}>
                      {prereq.title}
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Next Topics */}
        {topic.nextTopics && topic.nextTopics.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Sonraki Konular
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {topic.nextTopics.slice(0, 3).map((nextId) => {
                const next = getTopicById(nextId);
                if (!next) return null;
                
                return (
                  <Link key={nextId} href={`/topic/${nextId}`}>
                    <div className={cn(
                      'p-2 rounded-lg border text-xs font-medium transition-colors',
                      'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300',
                      'hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-300'
                    )}>
                      {next.title}
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {progress && progress.quizScores.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                İstatistikler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Quiz Sayısı:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{progress.quizScores.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Geçirilen Süre:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{formatDuration(progress.timeSpent)}</span>
              </div>
              {progress.quizScores.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Son Quiz Skoru:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {progress.quizScores[progress.quizScores.length - 1].score}/
                    {progress.quizScores[progress.quizScores.length - 1].totalQuestions}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
}

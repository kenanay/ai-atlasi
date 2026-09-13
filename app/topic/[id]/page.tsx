'use client';

import { use, useEffect } from 'react';
import { useProgress } from '@/lib/use-progress';
import { useRouter } from 'next/navigation';
import { getTopicById } from '@/lib/topics';
import { 
  getTopicProgress, 
  updateTopicStatus, 
  toggleBookmark,
  markLevelCompleted,
  setTopicLevel,
  addTimeSpent
} from '@/lib/progress';
import { TopicSidebar } from '@/components/topic/TopicSidebar';
import { TopicContent } from '@/components/topic/TopicContent';
import { TopicRightPanel } from '@/components/topic/TopicRightPanel';
import { TopicLevel } from '@/types';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface TopicPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TopicPage({ params }: TopicPageProps) {
  const { id } = use(params);
  return <TopicSession key={id} id={id} />;
}

function TopicSession({ id }: { id: string }) {
  const router = useRouter();
  const topic = getTopicById(id);
  
  const allProgress = useProgress();
  const progress = allProgress.find(p => p.topicId === id) ?? null;
  const currentLevel = progress?.currentLevel ?? 0;

  useEffect(() => {
    if (!topic) return;
    const saved = getTopicProgress(id);
    updateTopicStatus(id, !saved || saved.status === 'not_started' ? 'in_progress' : saved.status);
    let started = document.visibilityState === 'visible' ? Date.now() : null;
    const flush = () => {
      if (started === null) return;
      const elapsed = (Date.now() - started) / 60000;
      started = null;
      if (elapsed > 0) addTimeSpent(id, elapsed);
    };
    const visibility = () => {
      flush();
      if (document.visibilityState === 'visible') started = Date.now();
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [id, topic]);

  if (!topic) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Konu Bulunamadı</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Aradığınız konu mevcut değil veya taşınmış olabilir.</p>
          <Button onClick={() => router.push('/topics')}>
            Konulara Dön
          </Button>
        </div>
      </div>
    );
  }

  const handleLevelChange = (level: TopicLevel) => {
    setTopicLevel(id, level);
  };

  const handleBookmarkToggle = () => {
    toggleBookmark(id);
  };

  const handleMarkLevelCompleted = () => {
    markLevelCompleted(id, currentLevel);
  };

  const handlePreviousLevel = () => {
    if (currentLevel > 0) {
      setTopicLevel(id, (currentLevel - 1) as TopicLevel);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 4) {
      // Mevcut seviyeyi tamamlandı olarak işaretle
      markLevelCompleted(id, currentLevel);
        // Sonraki seviyeye geç
      setTopicLevel(id, (currentLevel + 1) as TopicLevel);
    }
  };

  const completedLevels = progress?.completedLevels || [];
  const isCurrentLevelCompleted = completedLevels.includes(currentLevel);
  const canGoToNextLevel = currentLevel < 4;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Left Sidebar */}
      <TopicSidebar
        topic={topic}
        currentLevel={currentLevel}
        progress={progress}
        onLevelChange={handleLevelChange}
        onBookmarkToggle={handleBookmarkToggle}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        <TopicContent topic={topic} level={currentLevel} />
        
        {/* Bottom Navigation */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-3.5 flex items-center justify-between shadow-xs transition-colors shrink-0">
          <Button
            variant="outline"
            onClick={handlePreviousLevel}
            disabled={currentLevel === 0}
            className="gap-1.5 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            Önceki Seviye
          </Button>

          <div className="flex items-center gap-3">
            {!isCurrentLevelCompleted && (
              <Button
                variant="secondary"
                onClick={handleMarkLevelCompleted}
                className="gap-2 text-xs"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Bu Seviyeyi Tamamladım
              </Button>
            )}
            
            {isCurrentLevelCompleted && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Seviye Tamamlandı</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleNextLevel}
            disabled={!canGoToNextLevel}
            className="gap-1.5 text-xs"
          >
            Sonraki Seviye
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <TopicRightPanel topic={topic} level={currentLevel} />
    </div>
  );
}

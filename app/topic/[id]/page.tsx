'use client';

import { use, useEffect, useState } from 'react';
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
import { ChevronLeft, ChevronRight, CheckCircle, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { usePyodidePreload } from '@/hooks/usePyodidePreload';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

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

  // Pyodide preload for Level 2+ (background WebAssembly load)
  usePyodidePreload(currentLevel >= 2);

  // Panel collapse state with localStorage persistence
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // Load panel states from localStorage on mount
  useEffect(() => {
    const leftOpen = localStorage.getItem('topic-left-panel-open');
    const rightOpen = localStorage.getItem('topic-right-panel-open');
    
    if (leftOpen !== null) setIsLeftPanelOpen(leftOpen === 'true');
    if (rightOpen !== null) setIsRightPanelOpen(rightOpen === 'true');
  }, []);

  // Keyboard shortcuts for panel toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Ctrl+B or Cmd+B: Toggle left panel
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleLeftPanel();
      }
      // Ctrl+J or Cmd+J: Toggle right panel
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        toggleRightPanel();
      }
      // Number keys 0-4: Quick level switch
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        const num = parseInt(e.key);
        if (num >= 0 && num <= 4) {
          e.preventDefault();
          handleLevelChange(num as TopicLevel);
        }
      }
      // ArrowLeft: Previous level
      if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        if (currentLevel > 0) {
          e.preventDefault();
          handlePreviousLevel();
        }
      }
      // ArrowRight: Next level
      if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
        if (currentLevel < 4) {
          e.preventDefault();
          handleNextLevel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(prev => {
      const newState = !prev;
      localStorage.setItem('topic-left-panel-open', String(newState));
      return newState;
    });
  };

  const toggleRightPanel = () => {
    setIsRightPanelOpen(prev => {
      const newState = !prev;
      localStorage.setItem('topic-right-panel-open', String(newState));
      return newState;
    });
  };

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
      {/* Left Sidebar with Collapse */}
      <div className={`relative transition-all duration-300 ease-in-out ${isLeftPanelOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
        <ErrorBoundary componentName="Sol Panel (Konu Ağacı)">
          <TopicSidebar
            topic={topic}
            currentLevel={currentLevel}
            progress={progress}
            onLevelChange={handleLevelChange}
            onBookmarkToggle={handleBookmarkToggle}
          />
        </ErrorBoundary>
      </div>

      {/* Left Panel Toggle Button */}
      <button
        onClick={toggleLeftPanel}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-lg shadow-lg hover:shadow-xl transition-all duration-200 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 group"
        style={{ left: isLeftPanelOpen ? '320px' : '0px' }}
        title={isLeftPanelOpen ? 'Sol Paneli Gizle (Ctrl+B)' : 'Sol Paneli Aç (Ctrl+B)'}
      >
        {isLeftPanelOpen ? (
          <PanelLeftClose className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
        ) : (
          <PanelLeftOpen className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        <ErrorBoundary componentName="Konu İçeriği">
          <TopicContent topic={topic} level={currentLevel} />
        </ErrorBoundary>
        
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

      {/* Right Panel Toggle Button */}
      <button
        onClick={toggleRightPanel}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-200 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 group"
        style={{ right: isRightPanelOpen ? '384px' : '0px' }}
        title={isRightPanelOpen ? 'Sağ Paneli Gizle (Ctrl+J)' : 'Sağ Paneli Aç (Ctrl+J)'}
      >
        {isRightPanelOpen ? (
          <PanelRightClose className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
        ) : (
          <PanelRightOpen className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
        )}
      </button>

      {/* Right Panel with Collapse */}
      <div className={`relative transition-all duration-300 ease-in-out ${isRightPanelOpen ? 'w-96' : 'w-0'} overflow-hidden`}>
        <ErrorBoundary componentName="Sağ Panel (Quiz & Kod Editörü)">
          <TopicRightPanel topic={topic} level={currentLevel} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

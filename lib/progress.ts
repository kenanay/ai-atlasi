import { UserProgress, TopicStatus, TopicLevel } from '@/types';
import { getAllTopics } from './topics';
export { isTopicUnlocked } from './topics';

export const STORAGE_KEY = 'ai-atlasi-progress';

export function validateProgress(data: unknown): data is UserProgress[] {
  if (!Array.isArray(data)) return false;
  const ids = new Set<string>();
  const level = (n: unknown) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 4;
  const date = (s: unknown) => typeof s === 'string' && Number.isFinite(Date.parse(s));
  return data.every(p => {
    if (!p || typeof p !== 'object' || typeof p.topicId !== 'string' || !p.topicId || ids.has(p.topicId)) return false;
    ids.add(p.topicId);
    return ['not_started', 'in_progress', 'completed', 'reviewing'].includes(p.status)
      && level(p.currentLevel) && Array.isArray(p.completedLevels) && p.completedLevels.every(level)
      && new Set(p.completedLevels).size === p.completedLevels.length
      && (p.status !== 'completed' || p.completedLevels.length === 5)
      && typeof p.timeSpent === 'number' && Number.isFinite(p.timeSpent) && p.timeSpent >= 0
      && typeof p.notes === 'string' && typeof p.bookmarked === 'boolean' && date(p.lastAccessed)
      && Array.isArray(p.quizScores) && p.quizScores.every((q: UserProgress['quizScores'][number]) =>
        q && date(q.date) && Number.isInteger(q.score) && Number.isInteger(q.totalQuestions)
        && q.totalQuestions > 0 && q.score >= 0 && q.score <= q.totalQuestions);
  });
}

// LocalStorage'dan ilerlemeyi yükle
export function loadProgress(): UserProgress[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const data: unknown = stored ? JSON.parse(stored) : [];
    return validateProgress(data) ? data : [];
  } catch (error) {
    console.error('İlerleme yüklenemedi:', error);
    return [];
  }
}

// LocalStorage'a ilerlemeyi kaydet
export function saveProgress(progress: UserProgress[]): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event('ai-atlasi-progress-change'));
    return true;
  } catch (error) {
    console.error('İlerleme kaydedilemedi:', error);
    throw error;
  }
}

// Belirli bir konunun ilerlemesini getir
export function getTopicProgress(topicId: string): UserProgress | null {
  const allProgress = loadProgress();
  return allProgress.find(p => p.topicId === topicId) || null;
}

// Konu ilerlemesini güncelle
export function updateTopicProgress(progress: UserProgress): void {
  const allProgress = loadProgress();
  const index = allProgress.findIndex(p => p.topicId === progress.topicId);
  
  if (index >= 0) {
    allProgress[index] = {
      ...allProgress[index],
      ...progress,
      lastAccessed: new Date().toISOString(),
    };
  } else {
    allProgress.push({
      ...progress,
      lastAccessed: new Date().toISOString(),
    });
  }
  
  saveProgress(allProgress);
}

// Konu durumunu güncelle
export function updateTopicStatus(topicId: string, status: TopicStatus): void {
  const currentProgress = getTopicProgress(topicId) || {
    topicId,
    status: 'not_started',
    currentLevel: 0,
    completedLevels: [],
    timeSpent: 0,
    quizScores: [],
    notes: '',
    lastAccessed: new Date().toISOString(),
    bookmarked: false,
  };
  
  updateTopicProgress({
    ...currentProgress,
    status,
  });
}

// Seviye tamamlandı olarak işaretle
export function markLevelCompleted(topicId: string, level: TopicLevel): void {
  const currentProgress = getTopicProgress(topicId) || {
    topicId,
    status: 'in_progress',
    currentLevel: level,
    completedLevels: [],
    timeSpent: 0,
    quizScores: [],
    notes: '',
    lastAccessed: new Date().toISOString(),
    bookmarked: false,
  };
  
  const completedLevels = Array.from(new Set([...currentProgress.completedLevels, level]));
  
  
  updateTopicProgress({
    ...currentProgress,
    completedLevels,
    currentLevel: currentProgress.currentLevel,
    status: completedLevels.length === 5 ? 'completed' : 'in_progress',
  });
}

// Quiz sonucu ekle
export function addQuizScore(
  topicId: string,
  score: number,
  totalQuestions: number
): void {
  const currentProgress = getTopicProgress(topicId) || {
    topicId,
    status: 'in_progress',
    currentLevel: 0,
    completedLevels: [],
    timeSpent: 0,
    quizScores: [],
    notes: '',
    lastAccessed: new Date().toISOString(),
    bookmarked: false,
  };
  
  updateTopicProgress({
    ...currentProgress,
    quizScores: [
      ...currentProgress.quizScores,
      {
        date: new Date().toISOString(),
        score,
        totalQuestions,
      },
    ],
  });
}

// Geçirilen süreyi güncelle
export function addTimeSpent(topicId: string, minutes: number): void {
  const currentProgress = getTopicProgress(topicId) || {
    topicId,
    status: 'in_progress',
    currentLevel: 0,
    completedLevels: [],
    timeSpent: 0,
    quizScores: [],
    notes: '',
    lastAccessed: new Date().toISOString(),
    bookmarked: false,
  };
  
  updateTopicProgress({
    ...currentProgress,
    timeSpent: currentProgress.timeSpent + minutes,
  });
}

// Not ekle/güncelle
export function updateNotes(topicId: string, notes: string): void {
  const currentProgress = getTopicProgress(topicId) || {
    topicId,
    status: 'not_started',
    currentLevel: 0,
    completedLevels: [],
    timeSpent: 0,
    quizScores: [],
    notes: '',
    lastAccessed: new Date().toISOString(),
    bookmarked: false,
  };
  
  updateTopicProgress({
    ...currentProgress,
    notes,
  });
}

// Bookmark durumunu değiştir
export function toggleBookmark(topicId: string): void {
  const currentProgress = getTopicProgress(topicId) || {
    topicId,
    status: 'not_started',
    currentLevel: 0,
    completedLevels: [],
    timeSpent: 0,
    quizScores: [],
    notes: '',
    lastAccessed: new Date().toISOString(),
    bookmarked: false,
  };
  
  updateTopicProgress({
    ...currentProgress,
    bookmarked: !currentProgress.bookmarked,
  });
}

// Tamamlanan konu ID'lerini getir
export function getCompletedTopicIds(allProgress = loadProgress()): string[] {
  return allProgress
    .filter(p => p.status === 'completed')
    .map(p => p.topicId);
}

// Devam edilen konu ID'lerini getir
export function getInProgressTopicIds(): string[] {
  const allProgress = loadProgress();
  return allProgress
    .filter(p => p.status === 'in_progress')
    .map(p => p.topicId);
}

// Bookmark'lanan konu ID'lerini getir
export function getBookmarkedTopicIds(): string[] {
  const allProgress = loadProgress();
  return allProgress
    .filter(p => p.bookmarked)
    .map(p => p.topicId);
}

// Genel istatistikler
export function getProgressStats(progress = loadProgress()) {
  const allProgress = progress.filter(p => getAllTopics().some(t => t.id === p.topicId));
  
  const totalTopics = allProgress.filter(p => p.status !== 'not_started').length;
  const completedCount = allProgress.filter(p => p.status === 'completed').length;
  const inProgressCount = allProgress.filter(p => p.status === 'in_progress').length;
  const totalTimeSpent = allProgress.reduce((sum, p) => sum + p.timeSpent, 0);
  const totalQuizzes = allProgress.reduce((sum, p) => sum + p.quizScores.length, 0);
  
  return {
    totalTopics,
    completedCount,
    inProgressCount,
    totalTimeSpent: Math.round(totalTimeSpent),
    totalQuizzes,
    completionRate: Math.round((completedCount / getAllTopics().length) * 100),
  };
}

// En son çalışılan konular
export function getRecentTopics(limit: number = 5, allProgress = loadProgress()): UserProgress[] {
  return allProgress
    .filter(p => p.status !== 'not_started')
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
    .slice(0, limit);
}

// Tüm ilerlemeyi sıfırla (dikkatli kullan!)
export function resetAllProgress(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('ai-atlasi-progress-change'));
}

// İlerleme verilerini dışa aktar
export function exportProgress(): string {
  const allProgress = loadProgress();
  return JSON.stringify(allProgress, null, 2);
}

// İlerleme verilerini içe aktar
export function importProgress(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    if (validateProgress(data)) {
      return saveProgress(data);
    }
    return false;
  } catch (error) {
    console.error('İçe aktarma hatası:', error);
    return false;
  }
}


export function setTopicLevel(topicId: string, level: TopicLevel): void {
  const progress = getTopicProgress(topicId);
  if (progress) {
    updateTopicProgress({ ...progress, currentLevel: level });
  } else {
    updateTopicProgress({
      topicId,
      status: 'in_progress',
      currentLevel: level,
      completedLevels: [],
      timeSpent: 0,
      quizScores: [],
      notes: '',
      lastAccessed: new Date().toISOString(),
      bookmarked: false,
    });
  }
}

import { UserProgress } from '@/types';
import { getAllTopics } from './topics';

export type BadgeType = 
  | 'first_topic'
  | 'topic_5'
  | 'topic_10'
  | 'topic_25'
  | 'topic_50'
  | 'all_topics'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'speed_demon'
  | 'night_owl'
  | 'early_bird'
  | 'quiz_master'
  | 'flashcard_pro'
  | 'category_master_math'
  | 'category_master_ml'
  | 'category_master_dl'
  | 'level_master_0'
  | 'level_master_1'
  | 'level_master_2'
  | 'level_master_3'
  | 'level_master_4'
  | 'perfectionist'
  | 'explorer';

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'completion' | 'streak' | 'mastery' | 'special';
  requirement: string;
}

export interface UserBadge {
  badgeId: BadgeType;
  unlockedAt: string;
  isNew?: boolean;
}

export const BADGES: Record<BadgeType, Badge> = {
  first_topic: {
    id: 'first_topic',
    name: 'İlk Adım',
    description: 'İlk konuyu tamamladın!',
    icon: '🎯',
    color: 'bg-blue-500',
    rarity: 'common',
    category: 'completion',
    requirement: '1 konu tamamla'
  },
  topic_5: {
    id: 'topic_5',
    name: 'Öğrenmeye Başladı',
    description: '5 konu tamamladın',
    icon: '📚',
    color: 'bg-green-500',
    rarity: 'common',
    category: 'completion',
    requirement: '5 konu tamamla'
  },
  topic_10: {
    id: 'topic_10',
    name: 'Bilgi Avcısı',
    description: '10 konu tamamladın',
    icon: '🎓',
    color: 'bg-indigo-500',
    rarity: 'rare',
    category: 'completion',
    requirement: '10 konu tamamla'
  },
  topic_25: {
    id: 'topic_25',
    name: 'Uzman Adayı',
    description: '25 konu tamamladın',
    icon: '🏆',
    color: 'bg-purple-500',
    rarity: 'rare',
    category: 'completion',
    requirement: '25 konu tamamla'
  },
  topic_50: {
    id: 'topic_50',
    name: 'AI Ustası',
    description: '50 konu tamamladın',
    icon: '👑',
    color: 'bg-yellow-500',
    rarity: 'epic',
    category: 'completion',
    requirement: '50 konu tamamla'
  },
  all_topics: {
    id: 'all_topics',
    name: 'Mükemmeliyetçi',
    description: 'Tüm konuları tamamladın!',
    icon: '💎',
    color: 'bg-gradient-to-r from-purple-600 to-pink-600',
    rarity: 'legendary',
    category: 'completion',
    requirement: 'Tüm konuları tamamla'
  },
  streak_3: {
    id: 'streak_3',
    name: 'İlk Streak',
    description: '3 gün üst üste çalıştın',
    icon: '🔥',
    color: 'bg-orange-500',
    rarity: 'common',
    category: 'streak',
    requirement: '3 günlük streak'
  },
  streak_7: {
    id: 'streak_7',
    name: 'Haftalık Warrior',
    description: '7 gün üst üste çalıştın',
    icon: '⚡',
    color: 'bg-amber-500',
    rarity: 'rare',
    category: 'streak',
    requirement: '7 günlük streak'
  },
  streak_30: {
    id: 'streak_30',
    name: 'Kararlılık Ödülü',
    description: '30 gün üst üste çalıştın',
    icon: '🌟',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    rarity: 'legendary',
    category: 'streak',
    requirement: '30 günlük streak'
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Hız Canavarı',
    description: 'Bir günde 5 konu tamamladın',
    icon: '⚡',
    color: 'bg-cyan-500',
    rarity: 'rare',
    category: 'special',
    requirement: '1 günde 5 konu'
  },
  night_owl: {
    id: 'night_owl',
    name: 'Gece Kuşu',
    description: 'Gece yarısından sonra çalıştın',
    icon: '🦉',
    color: 'bg-indigo-600',
    rarity: 'common',
    category: 'special',
    requirement: 'Gece 00:00-05:00 arası çalış'
  },
  early_bird: {
    id: 'early_bird',
    name: 'Erken Kalkan',
    description: 'Sabah erken saatte çalıştın',
    icon: '🌅',
    color: 'bg-rose-500',
    rarity: 'common',
    category: 'special',
    requirement: 'Sabah 05:00-08:00 arası çalış'
  },
  quiz_master: {
    id: 'quiz_master',
    name: 'Quiz Ustası',
    description: '10 quiz %90+ puanla tamamladın',
    icon: '🎯',
    color: 'bg-teal-500',
    rarity: 'rare',
    category: 'mastery',
    requirement: '10 quiz %90+ skor'
  },
  flashcard_pro: {
    id: 'flashcard_pro',
    name: 'Flashcard Pro',
    description: '50 flashcard öğrendin',
    icon: '🃏',
    color: 'bg-violet-500',
    rarity: 'rare',
    category: 'mastery',
    requirement: '50 flashcard biliniyor durumunda'
  },
  category_master_math: {
    id: 'category_master_math',
    name: 'Matematik Ustası',
    description: 'Matematik kategorisindeki tüm konuları tamamladın',
    icon: '📐',
    color: 'bg-blue-600',
    rarity: 'epic',
    category: 'mastery',
    requirement: 'Matematik kategorisini bitir'
  },
  category_master_ml: {
    id: 'category_master_ml',
    name: 'ML Uzmanı',
    description: 'ML kategorisindeki tüm konuları tamamladın',
    icon: '🤖',
    color: 'bg-green-600',
    rarity: 'epic',
    category: 'mastery',
    requirement: 'ML kategorisini bitir'
  },
  category_master_dl: {
    id: 'category_master_dl',
    name: 'Deep Learning Pro',
    description: 'Deep Learning kategorisindeki tüm konuları tamamladın',
    icon: '🧠',
    color: 'bg-purple-600',
    rarity: 'epic',
    category: 'mastery',
    requirement: 'Deep Learning kategorisini bitir'
  },
  level_master_0: {
    id: 'level_master_0',
    name: 'Temel Bilgi',
    description: 'Seviye 0 konularını tamamladın',
    icon: '🌱',
    color: 'bg-emerald-500',
    rarity: 'common',
    category: 'mastery',
    requirement: 'Tüm Seviye 0 konuları'
  },
  level_master_1: {
    id: 'level_master_1',
    name: 'Başlangıç Seviyesi',
    description: 'Seviye 1 konularını tamamladın',
    icon: '🌿',
    color: 'bg-green-500',
    rarity: 'common',
    category: 'mastery',
    requirement: 'Tüm Seviye 1 konuları'
  },
  level_master_2: {
    id: 'level_master_2',
    name: 'Orta Seviye',
    description: 'Seviye 2 konularını tamamladın',
    icon: '🌳',
    color: 'bg-lime-500',
    rarity: 'rare',
    category: 'mastery',
    requirement: 'Tüm Seviye 2 konuları'
  },
  level_master_3: {
    id: 'level_master_3',
    name: 'İleri Seviye',
    description: 'Seviye 3 konularını tamamladın',
    icon: '🎄',
    color: 'bg-amber-600',
    rarity: 'epic',
    category: 'mastery',
    requirement: 'Tüm Seviye 3 konuları'
  },
  level_master_4: {
    id: 'level_master_4',
    name: 'Uzman Seviyesi',
    description: 'Seviye 4 konularını tamamladın',
    icon: '🌲',
    color: 'bg-orange-600',
    rarity: 'epic',
    category: 'mastery',
    requirement: 'Tüm Seviye 4 konuları'
  },
  perfectionist: {
    id: 'perfectionist',
    name: 'Mükemmeliyetçi',
    description: 'Tüm konuları %100 tamamladın',
    icon: '💯',
    color: 'bg-gradient-to-r from-pink-500 to-rose-500',
    rarity: 'legendary',
    category: 'mastery',
    requirement: 'Her konuda tüm seviyeleri bitir'
  },
  explorer: {
    id: 'explorer',
    name: 'Kaşif',
    description: '3 farklı kategoride çalıştın',
    icon: '🗺️',
    color: 'bg-sky-500',
    rarity: 'common',
    category: 'special',
    requirement: '3 farklı kategoride ilerleme'
  },
};

const STORAGE_KEY = 'ai-atlasi-badges';

// Badge listesini yükle
export function loadBadges(): UserBadge[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Badge yüklenemedi:', error);
    return [];
  }
}

// Badge kaydet
export function saveBadges(badges: UserBadge[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
    window.dispatchEvent(new Event('ai-atlasi-badges-change'));
  } catch (error) {
    console.error('Badge kaydedilemedi:', error);
  }
}

// Badge unlock kontrolü
export function checkAndUnlockBadges(progress: UserProgress[]): UserBadge[] {
  const currentBadges = loadBadges();
  const unlockedIds = new Set(currentBadges.map(b => b.badgeId));
  const newBadges: UserBadge[] = [];
  const allTopics = getAllTopics();

  const completedCount = progress.filter(p => p.status === 'completed').length;
  const now = new Date().toISOString();

  // Completion badges
  const completionChecks: [number, BadgeType][] = [
    [1, 'first_topic'],
    [5, 'topic_5'],
    [10, 'topic_10'],
    [25, 'topic_25'],
    [50, 'topic_50'],
    [allTopics.length, 'all_topics']
  ];

  for (const [count, badgeId] of completionChecks) {
    if (completedCount >= count && !unlockedIds.has(badgeId)) {
      newBadges.push({ badgeId, unlockedAt: now, isNew: true });
      unlockedIds.add(badgeId);
    }
  }

  // Level mastery badges
  for (let level = 0; level <= 4; level++) {
    const badgeId = `level_master_${level}` as BadgeType;
    const levelTopics = allTopics.filter(t => t.level === level);
    const completedLevelTopics = levelTopics.filter(t =>
      progress.find(p => p.topicId === t.id)?.status === 'completed'
    );

    if (levelTopics.length > 0 && completedLevelTopics.length === levelTopics.length && !unlockedIds.has(badgeId)) {
      newBadges.push({ badgeId, unlockedAt: now, isNew: true });
      unlockedIds.add(badgeId);
    }
  }

  // Category mastery badges - FIX: Multiple categories should be combined
  const categoryBadgeMap: Partial<Record<BadgeType, string[]>> = {
    'category_master_math': ['linear-algebra', 'calculus', 'math', 'matematik'],
    'category_master_ml': ['supervised-learning', 'unsupervised-learning', 'classical-ml'],
    'category_master_dl': ['neural-networks', 'deep-learning']
  };

  for (const [badgeId, categories] of Object.entries(categoryBadgeMap)) {
    // Get ALL topics from ALL these categories
    const categoryTopics = allTopics.filter(t => categories.includes(t.category));
    const completedCategoryTopics = categoryTopics.filter(t =>
      progress.find(p => p.topicId === t.id)?.status === 'completed'
    );

    if (categoryTopics.length > 0 && completedCategoryTopics.length === categoryTopics.length && !unlockedIds.has(badgeId as BadgeType)) {
      newBadges.push({ badgeId: badgeId as BadgeType, unlockedAt: now, isNew: true });
      unlockedIds.add(badgeId as BadgeType);
    }
  }

  // Quiz master
  const highScoreQuizzes = progress.reduce((count, p) => {
    const highScores = p.quizScores.filter(q => (q.score / q.totalQuestions) >= 0.9);
    return count + highScores.length;
  }, 0);

  if (highScoreQuizzes >= 10 && !unlockedIds.has('quiz_master')) {
    newBadges.push({ badgeId: 'quiz_master', unlockedAt: now, isNew: true });
    unlockedIds.add('quiz_master');
  }

  // Explorer
  const categories = new Set(
    progress
      .filter(p => p.status !== 'not_started')
      .map(p => allTopics.find(t => t.id === p.topicId)?.category)
      .filter(Boolean)
  );

  if (categories.size >= 3 && !unlockedIds.has('explorer')) {
    newBadges.push({ badgeId: 'explorer', unlockedAt: now, isNew: true });
    unlockedIds.add('explorer');
  }

  // Perfectionist
  const allCompleteWithAllLevels = allTopics.every(topic => {
    const prog = progress.find(p => p.topicId === topic.id);
    return prog?.status === 'completed' && prog.completedLevels.length === 5;
  });

  if (allCompleteWithAllLevels && allTopics.length > 0 && !unlockedIds.has('perfectionist')) {
    newBadges.push({ badgeId: 'perfectionist', unlockedAt: now, isNew: true });
    unlockedIds.add('perfectionist');
  }

  // Yeni badge'ler varsa kaydet
  if (newBadges.length > 0) {
    saveBadges([...currentBadges, ...newBadges]);
  }

  return newBadges;
}

// Tüm kazanılan badge'leri getir
export function getUnlockedBadges(): UserBadge[] {
  return loadBadges();
}

// Badge istatistikleri
export function getBadgeStats() {
  const unlocked = loadBadges();
  const total = Object.keys(BADGES).length;

  const byRarity = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0
  };

  const byCategory = {
    completion: 0,
    streak: 0,
    mastery: 0,
    special: 0
  };

  unlocked.forEach(ub => {
    const badge = BADGES[ub.badgeId];
    if (badge) {
      byRarity[badge.rarity]++;
      byCategory[badge.category]++;
    }
  });

  return {
    total,
    unlocked: unlocked.length,
    percentage: Math.round((unlocked.length / total) * 100),
    byRarity,
    byCategory
  };
}

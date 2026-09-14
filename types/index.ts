import type {
  Topic,
  TopicCategory,
  TopicLevel,
  CodeExample,
  QuizQuestion,
  Visualization,
  LevelItem
} from '@/data/schemas/topic.schema';

export type {
  Topic,
  TopicCategory,
  TopicLevel,
  CodeExample,
  QuizQuestion,
  Visualization,
  LevelItem
};

export interface LevelInfo {
  level: TopicLevel;
  name: string;
  description: string;
}

// Konu durumu
export type TopicStatus = 'not_started' | 'in_progress' | 'completed' | 'reviewing';

// Kullanıcı ilerlemesi
export interface UserProgress {
  userId?: string;
  topicId: string;
  status: TopicStatus;
  currentLevel: TopicLevel;
  completedLevels: TopicLevel[];
  timeSpent: number; // dakika
  quizScores: {
    date: string;
    score: number;
    totalQuestions: number;
  }[];
  notes: string;
  lastAccessed: string;
  bookmarked: boolean;
}

// Öğrenme yolu
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  topics: string[]; // Sıralı konu ID'leri
  estimatedDuration: number; // saat
  difficulty: TopicLevel;
}

// Konu ağacı düğümü
export interface TopicTreeNode {
  topic: Topic;
  children: TopicTreeNode[];
  depth: number;
  isUnlocked: boolean;
  progress?: UserProgress;
}

// Arama sonucu
export interface SearchResult {
  topic: Topic;
  matchType: 'title' | 'content' | 'tag';
  relevance: number;
}

// Seviye tanımları
export type TopicLevel = 0 | 1 | 2 | 3 | 4;

export interface LevelInfo {
  level: TopicLevel;
  name: string;
  description: string;
}

// Konu kategorileri
export type TopicCategory = 
  | 'computer-science'
  | 'python'
  | 'linear-algebra'
  | 'calculus'
  | 'probability'
  | 'optimization'
  | 'data-preparation'
  | 'supervised-learning'
  | 'unsupervised-learning'
  | 'neural-networks'
  | 'cnn'
  | 'rnn'
  | 'transformer'
  | 'generative-ai'
  | 'llm'
  | 'hardware'
  | 'mlops';

// Konu durumu
export type TopicStatus = 'not_started' | 'in_progress' | 'completed' | 'reviewing';

// Kod örneği tipi
export interface CodeExample {
  title?: string; // YENİ: Kod örneği başlığı
  language: 'python' | 'numpy' | 'pytorch' | 'javascript';
  code: string;
  explanation: string;
  runnable?: boolean;
}

// Quiz sorusu
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'code-completion' | 'mathematical';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: TopicLevel;
}

// Görselleştirme
export interface Visualization {
  id: string;
  type: string;
  title: string;
  description: string;
  component?: string; // Hangi React component'i kullanılacak
  data?: Record<string, unknown>;
}

// Ana konu yapısı
export interface Topic {
  id: string;
  title: string;
  shortTitle?: string; // Kısa başlık (graflar için)
  category: TopicCategory;
  level: TopicLevel;
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; // Zorluk seviyesi
  estimatedTime: number; // dakika cinsinden
  description?: string; // Kısa açıklama
  
  // İçerik seviyeleri (ESKİ FORMAT)
  content?: {
    level0_basic?: string; // Temel - Günlük dille
    level1_beginner?: string; // Başlangıç - Basit kavramlar
    level2_application?: string; // Uygulama - Kod örnekleri
    level3_advanced?: string; // İleri - Matematiksel detaylar
    level4_expert?: string; // Uzman - Mimari, performans
  };
  
  // İçerik seviyeleri (YENİ FORMAT)
  levels?: Array<{
    level: TopicLevel;
    title: string;
    content: string;
    keyPoints?: string[];
  }>;
  
  // Açıklamalar
  whatIsIt?: string;
  whyNeeded?: string;
  realWorldAnalogy?: string;
  commonMistakes?: Array<{
    mistake: string;
    why: string;
    fix: string;
  }> | string[];
  
  // Matematiksel içerik
  mathematics?: {
    formulas: string[]; // LaTeX formatında
    proofs?: string[];
    derivations?: string[];
  };
  
  // YENİ FORMAT: Formüller array olarak
  formulas?: Array<{
    title: string;
    latex: string;
    explanation: string;
  }>;
  
  // Algoritmik açıklama
  algorithm?: {
    pseudocode?: string;
    stepByStep: string[];
    complexity?: string;
  };
  
  // Kod örnekleri
  codeExamples: CodeExample[];
  
  // Görselleştirmeler
  visualizations?: Visualization[];
  
  // Bağımlılıklar
  prerequisites: string[]; // Ön koşul konu ID'leri
  nextTopics: string[]; // Sonraki önerilen konular
  relatedTopics?: string[]; // İlgili konular
  
  // Öğrenme materyalleri
  quiz: QuizQuestion[];
  flashcards?: {
    front: string;
    back: string;
  }[];
  
  // Referanslar
  references?: Array<{
    title: string;
    url?: string;
    author?: string;
    year?: number;
    type?: 'article' | 'video' | 'book' | 'documentation';
    description?: string;
  }>;
  
  // Metadata
  tags: string[]; // Boş array olabilir ama field var
  createdAt?: string;
  updatedAt?: string;
}

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

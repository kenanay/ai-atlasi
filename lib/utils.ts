import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Seviye bilgilerini döndür
export const LEVEL_INFO = {
  0: { name: 'Temel', description: 'Günlük dille, ön bilgi gerektirmeden', color: 'bg-green-500' },
  1: { name: 'Başlangıç', description: 'Temel kavramlar ve basit örnekler', color: 'bg-blue-500' },
  2: { name: 'Uygulama', description: 'Python ve kütüphane kodları', color: 'bg-purple-500' },
  3: { name: 'İleri', description: 'Matematiksel türetimler', color: 'bg-orange-500' },
  4: { name: 'Uzman', description: 'Mimari, performans ve üretim', color: 'bg-red-500' },
};

// Kategori bilgilerini döndür (Konsolide Edilmiş - 7 Ana Kategori)
export const CATEGORY_INFO: Record<string, { name: string; icon: string; color: string }> = {
  // 1. MATEMATİK & TEORİ (tüm matematik konuları tek çatı altında)
  'math': { name: 'Matematik & Teori', icon: '🔢', color: 'bg-blue-100' },
  'matematik': { name: 'Matematik & Teori', icon: '🔢', color: 'bg-blue-100' },
  'linear-algebra': { name: 'Matematik & Teori', icon: '🔢', color: 'bg-blue-100' },
  'calculus': { name: 'Matematik & Teori', icon: '🔢', color: 'bg-blue-100' },
  'probability': { name: 'Matematik & Teori', icon: '🔢', color: 'bg-blue-100' },
  'statistics': { name: 'Matematik & Teori', icon: '🔢', color: 'bg-blue-100' },
  'fundamentals': { name: 'Matematik & Teori', icon: '🔢', color: 'bg-blue-100' },
  
  // 2. KLASİK MAKİNE ÖĞRENMESİ (supervised + unsupervised + classical birleşti)
  'classical-ml': { name: 'Klasik Makine Öğrenmesi', icon: '📊', color: 'bg-cyan-100' },
  'supervised-learning': { name: 'Klasik Makine Öğrenmesi', icon: '📊', color: 'bg-cyan-100' },
  'unsupervised-learning': { name: 'Klasik Makine Öğrenmesi', icon: '📊', color: 'bg-cyan-100' },
  'reinforcement-learning': { name: 'Pekiştirmeli Öğrenme', icon: '🎮', color: 'bg-amber-100' },
  
  // 3. DERİN ÖĞRENME & SİNİR AĞLARI (neural-networks + deep-learning birleşti)
  'deep-learning': { name: 'Derin Öğrenme', icon: '🧠', color: 'bg-red-100' },
  'neural-networks': { name: 'Derin Öğrenme', icon: '🧠', color: 'bg-red-100' },
  'cnn': { name: 'Derin Öğrenme', icon: '🧠', color: 'bg-red-100' },
  'rnn': { name: 'Derin Öğrenme', icon: '🧠', color: 'bg-red-100' },
  'transformer': { name: 'Derin Öğrenme', icon: '🧠', color: 'bg-red-100' },
  
  // 4. BİLGİSAYARLI GÖRÜ
  'computer-vision': { name: 'Bilgisayarlı Görü', icon: '👁️', color: 'bg-teal-100' },
  
  // 5. NLP & BÜYÜK DİL MODELLERİ (nlp + natural-language-processing + llm birleşti)
  'nlp': { name: 'NLP & Büyük Dil Modelleri', icon: '💬', color: 'bg-violet-100' },
  'natural-language-processing': { name: 'NLP & Büyük Dil Modelleri', icon: '💬', color: 'bg-violet-100' },
  'llm': { name: 'NLP & Büyük Dil Modelleri', icon: '💬', color: 'bg-violet-100' },
  
  // 6. ÜRETKEN MODELLER
  'generative-models': { name: 'Üretken Modeller', icon: '🎨', color: 'bg-fuchsia-100' },
  'generative-ai': { name: 'Üretken Modeller', icon: '🎨', color: 'bg-fuchsia-100' },
  
  // 7. MLOPS & SİSTEM (optimization + mlops + hardware + advanced + applications birleşti)
  'optimization': { name: 'MLOps & Sistem', icon: '🚀', color: 'bg-emerald-100' },
  'mlops': { name: 'MLOps & Sistem', icon: '🚀', color: 'bg-emerald-100' },
  'hardware': { name: 'MLOps & Sistem', icon: '🚀', color: 'bg-emerald-100' },
  'advanced': { name: 'MLOps & Sistem', icon: '🚀', color: 'bg-emerald-100' },
  'applications': { name: 'MLOps & Sistem', icon: '🚀', color: 'bg-emerald-100' },
  
  // Legacy (backward compat)
  'computer-science': { name: 'Matematik & Teori', icon: '🔢', color: 'bg-blue-100' },
  'python': { name: 'MLOps & Sistem', icon: '🚀', color: 'bg-emerald-100' },
  'data-preparation': { name: 'MLOps & Sistem', icon: '🚀', color: 'bg-emerald-100' },
};

// Süre formatla
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} dakika`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} saat ${mins} dakika` : `${hours} saat`;
}

// Tarih formatla
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// İlerleme yüzdesini hesapla
export function calculateProgress(completedLevels: number[], totalLevels: number = 5): number {
  return Math.round((completedLevels.length / totalLevels) * 100);
}

// Konu kilidi kontrolü
export function isTopicUnlocked(
  topicPrerequisites: string[],
  completedTopics: string[]
): boolean {
  if (topicPrerequisites.length === 0) return true;
  return topicPrerequisites.every(prereq => completedTopics.includes(prereq));
}

// Quiz skorunu hesapla
export function calculateQuizScore(
  correctAnswers: number,
  totalQuestions: number
): { score: number; grade: string; message: string } {
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  let grade = 'F';
  let message = 'Konuyu tekrar gözden geçirmelisin';
  
  if (score >= 90) {
    grade = 'A';
    message = 'Mükemmel! Konuyu çok iyi anlamışsın';
  } else if (score >= 80) {
    grade = 'B';
    message = 'Çok iyi! Küçük detayları pekiştir';
  } else if (score >= 70) {
    grade = 'C';
    message = 'İyi! Bazı konuları tekrar et';
  } else if (score >= 60) {
    grade = 'D';
    message = 'Geçer, ama daha fazla çalışmalısın';
  }
  
  return { score, grade, message };
}

// Renk tonu oluştur
export function getProgressColor(progress: number): string {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 25) return 'bg-orange-500';
  return 'bg-gray-300';
}

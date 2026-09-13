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

// Kategori bilgilerini döndür
export const CATEGORY_INFO: Record<string, { name: string; icon: string; color: string }> = {
  'computer-science': { name: 'Bilgisayar Bilimine Giriş', icon: '💻', color: 'bg-slate-100' },
  'python': { name: 'Python Temelleri', icon: '🐍', color: 'bg-yellow-100' },
  'linear-algebra': { name: 'Lineer Cebir', icon: '📐', color: 'bg-blue-100' },
  'calculus': { name: 'Kalkülüs', icon: '∫', color: 'bg-green-100' },
  'probability': { name: 'Olasılık ve İstatistik', icon: '🎲', color: 'bg-purple-100' },
  'optimization': { name: 'Optimizasyon', icon: '📈', color: 'bg-orange-100' },
  'data-preparation': { name: 'Veri Hazırlama', icon: '🗂️', color: 'bg-cyan-100' },
  'supervised-learning': { name: 'Gözetimli Öğrenme', icon: '🎯', color: 'bg-pink-100' },
  'unsupervised-learning': { name: 'Gözetimsiz Öğrenme', icon: '🔍', color: 'bg-indigo-100' },
  'neural-networks': { name: 'Yapay Sinir Ağları', icon: '🧠', color: 'bg-red-100' },
  'cnn': { name: 'Konvolüsyonel Ağlar', icon: '🖼️', color: 'bg-teal-100' },
  'rnn': { name: 'Tekrarlayan Ağlar', icon: '🔄', color: 'bg-lime-100' },
  'transformer': { name: 'Transformer', icon: '⚡', color: 'bg-amber-100' },
  'generative-ai': { name: 'Üretken Yapay Zeka', icon: '🎨', color: 'bg-fuchsia-100' },
  'llm': { name: 'Büyük Dil Modelleri', icon: '💬', color: 'bg-violet-100' },
  'hardware': { name: 'Donanım ve Sistem', icon: '⚙️', color: 'bg-gray-100' },
  'mlops': { name: 'MLOps', icon: '🚀', color: 'bg-emerald-100' },
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

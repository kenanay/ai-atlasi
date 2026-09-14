'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getAllTopics } from '@/lib/topics';
import { useProgress } from '@/lib/use-progress';
import { CATEGORY_INFO } from '@/lib/utils';
import { Maximize2, Minimize2, X, Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Lazy load LearningMapGraph (React Flow is 2.9MB!)
const LearningMapGraph = dynamic(() => import('@/components/learning-map/LearningMapGraph'), {
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <p className="text-base text-slate-600 dark:text-slate-400 font-medium">Öğrenme haritası yükleniyor...</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">React Flow • 2.9MB • 80 konu grafiği</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default function LearningMapPage() {
  const router = useRouter();
  const topics = getAllTopics();
  const progressData = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // ESC to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);
  
  // Tamamlanmış konuları al
  const completedTopics = useMemo(() => {
    return progressData
      .filter(p => p.status === 'completed')
      .map(p => p.topicId);
  }, [progressData]);
  
  // Konsolide kategorileri al
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    topics.forEach(topic => {
      const categoryName = CATEGORY_INFO[topic.category]?.name || topic.category;
      categorySet.add(categoryName);
    });
    return Array.from(categorySet).sort();
  }, [topics]);
  
  // Seçili kategoriye göre konuları filtrele
  const filteredTopics = useMemo(() => {
    if (!selectedCategory) return topics;
    
    return topics.filter(topic => {
      const categoryName = CATEGORY_INFO[topic.category]?.name || topic.category;
      return categoryName === selectedCategory;
    });
  }, [topics, selectedCategory]);
  
  // İstatistikler
  const stats = useMemo(() => {
    const completed = completedTopics.length;
    const total = topics.length;
    const unlocked = topics.filter(topic => 
      topic.prerequisites.length === 0 || 
      topic.prerequisites.every(prereq => completedTopics.includes(prereq))
    ).length;
    const locked = total - unlocked;
    
    return {
      completed,
      total,
      unlocked: unlocked - completed,
      locked,
      percentage: Math.round((completed / total) * 100),
    };
  }, [topics, completedTopics]);
  
  const handleTopicClick = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  // Fullscreen mode render
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col">
        {/* Fullscreen Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-100">
              🗺️ Öğrenme Haritası - Tam Ekran Tuval
            </h1>
            <div className="text-xs text-slate-400">
              {selectedCategory ? `${filteredTopics.length} konu` : `${topics.length} konu`}
            </div>
          </div>
          
          {/* Fullscreen Controls */}
          <div className="flex items-center gap-2">
            {/* Category Filter Buttons */}
            <div className="flex gap-1 mr-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`
                  px-3 py-1 rounded text-xs font-medium transition-all
                  ${!selectedCategory 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }
                `}
              >
                Tümü
              </button>
              
              {categories.slice(0, 5).map(category => {
                const sampleTopic = topics.find(t => (CATEGORY_INFO[t.category]?.name || t.category) === category);
                const icon = sampleTopic ? (CATEGORY_INFO[sampleTopic.category]?.icon || '📚') : '📚';
                
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-3 py-1 rounded text-xs font-medium transition-all
                      ${selectedCategory === category
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }
                    `}
                    title={category}
                  >
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mr-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-slate-300">{stats.completed}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-slate-300">{stats.unlocked}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-gray-500"></div>
                <span className="text-slate-300">{stats.locked}</span>
              </div>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
              title="Tam Ekrandan Çık (ESC)"
            >
              <Minimize2 className="w-4 h-4" />
              Çık (ESC)
            </button>
          </div>
        </div>

        {/* Fullscreen Canvas */}
        <div className="flex-1 bg-slate-900">
          <ErrorBoundary componentName="Öğrenme Haritası Grafiği (Tam Ekran)">
            <LearningMapGraph
              topics={filteredTopics}
              completedTopics={completedTopics}
              onTopicClick={handleTopicClick}
              fullscreen={true}
            />
          </ErrorBoundary>
        </div>

        {/* Fullscreen Floating Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm rounded-lg p-3 shadow-2xl border border-slate-700">
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-slate-300">Tamamlandı</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-slate-300">Açık</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-500"></div>
              <span className="text-slate-300">Kilitli</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Normal mode render
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🗺️ Öğrenme Haritası
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm konuların önkoşul ilişkilerini görsel olarak keşfedin
          </p>
        </div>
        
        {/* İstatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.completed}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlandı</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-xl">→</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.unlocked}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Açık</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.locked}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kilitli</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.percentage}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">İlerleme</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Kategori Filtresi */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${!selectedCategory 
                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            Tümü ({topics.length})
          </button>
          
          {categories.map(category => {
            const categoryTopics = topics.filter(t => {
              const catName = CATEGORY_INFO[t.category]?.name || t.category;
              return catName === category;
            });
            
            // İkon bul
            const sampleTopic = categoryTopics[0];
            const icon = sampleTopic ? (CATEGORY_INFO[sampleTopic.category]?.icon || '📚') : '📚';
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                  ${selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span>{icon}</span>
                <span>{category}</span>
                <span className="text-xs opacity-75">({categoryTopics.length})</span>
              </button>
            );
          })}
        </div>
        
        {/* Lejant */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Lejant:</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ✓ Tamamlanmış Konu
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                → Açık Konu (Başlayabilirsiniz)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-400"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                🔒 Kilitli Konu (Önkoşulları tamamlayın)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tamamlanmış Önkoşul
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-gray-400"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Bekleyen Önkoşul
              </span>
            </div>
          </div>
        </div>
        
        {/* Graf */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCategory 
                ? `${filteredTopics.length} konu gösteriliyor` 
                : `Toplam ${topics.length} konu`}
            </p>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-500">
                💡 İpucu: Fare tekerleği ile zoom, sürükleyerek hareket ettirin
              </div>
              <button
                onClick={() => setIsFullscreen(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium shadow-sm"
                title="Tam Ekran Tuval (Figma/Miro benzeri)"
              >
                <Maximize2 className="w-4 h-4" />
                Tam Ekran
              </button>
            </div>
          </div>
          
          <ErrorBoundary componentName="Öğrenme Haritası Grafiği">
            <LearningMapGraph
              topics={filteredTopics}
              completedTopics={completedTopics}
              onTopicClick={handleTopicClick}
            />
          </ErrorBoundary>
        </div>
        
        {/* Yardım */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <span>💡</span>
            Nasıl Kullanılır?
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <strong>Konuya tıklayın</strong> → Detay sayfasına gidin</li>
            <li>• <strong>Oklar</strong> → Önkoşul ilişkilerini gösterir</li>
            <li>• <strong>Renkler</strong> → Tamamlanan (yeşil), açık (mavi), kilitli (gri)</li>
            <li>• <strong>Kategori filtreleri</strong> → Belirli bir alanı odaklayın</li>
            <li>• <strong>Mini harita</strong> (sağ alt) → Hızlı navigasyon</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

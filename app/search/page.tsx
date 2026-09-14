'use client';

import { useProgress } from '@/lib/use-progress';

import { useState } from 'react';
import { TopicCard } from '@/components/topic/TopicCard';
import { Card, CardContent } from '@/components/ui/Card';
import { searchTopics } from '@/lib/topics';
import { getCompletedTopicIds, isTopicUnlocked } from '@/lib/progress';
import { Search, X, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const allProgress = useProgress();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchTopics>>([]);
  const completedTopics = getCompletedTopicIds(allProgress);
  
  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      const results = searchTopics(value.trim());
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
            Konu Ara
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm md:text-base">
            Öğrenmek istediğiniz konuyu, matematiksel kavramı, algoritmayı veya teknolojiyi arayın.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative shadow-sm rounded-2xl">
            <label htmlFor="search-input" className="sr-only">
              Konu ara
            </label>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            <input
              id="search-input"
              type="search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Örn: vektör, gradient descent, transformer, CNN..."
              className="w-full pl-12 pr-12 py-3.5 text-base border-2 border-slate-300 dark:border-slate-700/80 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              aria-label="Konu arama kutusu"
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                aria-label="Aramayı temizle"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {query.trim().length > 0 && (
          <div>
            {query.trim().length < 2 ? (
              <Card className="max-w-2xl mx-auto border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Arama için en az 2 karakter yazın...
                  </p>
                </CardContent>
              </Card>
            ) : searchResults.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                  {searchResults.length} sonuç bulundu
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((topic) => {
                    const isLocked = !isTopicUnlocked(topic.id, completedTopics);
                    return (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        isLocked={isLocked}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto border-dashed">
                <CardContent className="py-12 text-center">
                  <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg mb-1">
                    &ldquo;{query}&rdquo; için sonuç bulunamadı
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Farklı bir arama terimi veya etiket deneyin.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Search Tips */}
        {!query && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <h3>Arama İpuçları</h3>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Konu başlıklarında, açıklamalarda ve etiketlerde hızlı arama yapılır.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Türkçe veya İngilizce terimlerle arayabilirsiniz (ör. matris veya matrix).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Kısaltmalar desteklenir: CNN, RNN, GPU, LLM, VCF vb.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Örnek aramalar: gradient descent, attention, embedding, backpropagation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

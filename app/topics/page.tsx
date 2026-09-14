'use client';

import { useProgress } from '@/lib/use-progress';

import { useState } from 'react';
import { TopicCard } from '@/components/topic/TopicCard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAllTopics, getTopicsByCategory } from '@/lib/topics';
import { getCompletedTopicIds, isTopicUnlocked } from '@/lib/progress';
import { CATEGORY_INFO, LEVEL_INFO } from '@/lib/utils';
import { TopicCategory, TopicLevel } from '@/types';
import { Filter, Grid, List, Lock } from 'lucide-react';

export default function TopicsPage() {
  const allProgress = useProgress();
  const allTopics = getAllTopics();
  const topicsByCategory = getTopicsByCategory();
  const completedTopics = getCompletedTopicIds(allProgress);
  
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<TopicLevel | 'all'>('all');
  const [showLockedTopics, setShowLockedTopics] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filtreleme
  const filteredTopics = allTopics.filter((topic) => {
    // Kategori filtresi - konsolide grup adını kontrol et
    if (selectedCategory !== 'all') {
      const groupName = CATEGORY_INFO[topic.category]?.name || topic.category;
      if (groupName !== selectedCategory) return false;
    }
    if (selectedLevel !== 'all' && topic.level !== selectedLevel) return false;
    
    const isLocked = !isTopicUnlocked(topic.id, completedTopics);
    if (!showLockedTopics && isLocked) return false;
    
    return true;
  });
  
  // Kategoriye göre grupla
  const groupedTopics = Array.from(topicsByCategory.entries())
    .filter(([category]) => selectedCategory === 'all' || category === selectedCategory)
    .map(([category, topics]) => ({
      category,
      topics: topics.filter(topic => {
        if (selectedLevel !== 'all' && topic.level !== selectedLevel) return false;
        const isLocked = !isTopicUnlocked(topic.id, completedTopics);
        if (!showLockedTopics && isLocked) return false;
        return true;
      }),
    }))
    .filter(group => group.topics.length > 0);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
              <span className="gradient-text">Tüm Konular</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filteredTopics.length} konu listeleniyor
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-fade-in animate-delay-100">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Filtreler:
                  </span>
                </div>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {Array.from(topicsByCategory.keys()).map((categoryName) => {
                    // İlk konuyu bul ve ikonunu al
                    const topics = topicsByCategory.get(categoryName) || [];
                    const firstTopic = topics[0];
                    const icon = firstTopic ? (CATEGORY_INFO[firstTopic.category]?.icon || '📚') : '📚';
                    
                    return (
                      <option key={categoryName} value={categoryName}>
                        {icon} {categoryName}
                      </option>
                    );
                  })}
                </select>
                
                {/* Level Filter */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value) as TopicLevel)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  <option value="all">Tüm Seviyeler</option>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <option key={level} value={level}>
                      Seviye {level} - {LEVEL_INFO[level as TopicLevel].name}
                    </option>
                  ))}
                </select>
                
                {/* Show Locked Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showLockedTopics}
                    onChange={(e) => setShowLockedTopics(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Kilitli konuları göster
                  </span>
                </label>
                
                <div className="ml-auto flex items-center gap-1.5">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    title="Grid Görünümü"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    title="Liste Görünümü"
                  >
                    <List className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topics by Category */}
          <div className="space-y-10">
            {groupedTopics.map(({ category, topics }) => {
              // Konsolide grup adından bilgi al - ilk konunun category'sini kullan
              const firstTopic = topics[0];
              const categoryInfo = firstTopic ? CATEGORY_INFO[firstTopic.category] : null;
              const displayName = category; // Konsolide grup adını kullan
              
              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                    <span className="text-2xl">{categoryInfo?.icon || '📚'}</span>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {displayName}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {topics.length} konu
                      </p>
                    </div>
                  </div>
                  
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-4'
                  }>
                    {topics.map((topic) => {
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
              );
            })}
          </div>

          {/* No Results */}
          {filteredTopics.length === 0 && (
            <Card className="py-12 border-dashed">
              <CardContent className="text-center">
                <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">Hiç konu bulunamadı</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Filtreleri değiştirerek daha fazla sonuç görebilirsiniz
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

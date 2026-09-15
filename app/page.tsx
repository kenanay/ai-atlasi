'use client';

import { useProgress } from '@/lib/use-progress';

import Link from 'next/link';
import { TopicCard } from '@/components/topic/TopicCard';
import { LearningPathCard } from '@/components/topic/LearningPathCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getAllTopics, suggestNextTopic, buildLearningPath } from '@/lib/topics';
import { getProgressStats, getRecentTopics, getCompletedTopicIds } from '@/lib/progress';
import { Brain, TrendingUp, Clock, Target, BookOpen, Zap } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

export default function Home() {
  const allProgress = useProgress();
  const allTopics = getAllTopics();
  const stats = getProgressStats(allProgress);
  const recentTopics = getRecentTopics(3, allProgress);
  const completedTopics = getCompletedTopicIds(allProgress);
  const nextTopic = suggestNextTopic(completedTopics);
  
  // İlk önerilen öğrenme yolu
  const learningPath = nextTopic ? buildLearningPath(nextTopic.id).slice(0, 5) : [];
  
  // Popüler konular (şu an ilk 3 konu)
  const popularTopics = allTopics.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-slate-50 to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6 animate-scale-in">
            <div className="flex items-center justify-center w-18 h-18 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow duration-300">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4 animate-fade-in">
            <span className="gradient-text">AI Atlası</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto animate-fade-in animate-delay-100">
            Matematikten donanıma, algoritmalardan büyük dil modellerine kadar
            yapay zeka alanını seviye seviye öğrenin ve deneyimleyin.
          </p>
          
          <div className="flex items-center justify-center gap-3 animate-fade-in animate-delay-200">
            <Link href="/topics">
              <Button size="lg" className="gap-2 font-semibold shadow-md shadow-blue-600/20">
                <BookOpen className="w-4 h-4" />
                Öğrenmeye Başla
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg" className="gap-2">
                <Target className="w-4 h-4" />
                Konu Ara
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="animate-fade-in animate-delay-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Toplam Konu</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{allTopics.length}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in animate-delay-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tamamlanan</p>
                  <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats.completedCount}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Target className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in animate-delay-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Devam Eden</p>
                  <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{stats.inProgressCount}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in animate-delay-400">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Toplam Süre</p>
                  <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                    {formatDuration(stats.totalTimeSpent)}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress & Next Topic */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Genel İlerleme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ProgressBar value={stats.completionRate} showLabel size="lg" />
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p>{stats.completedCount} / {allTopics.length} konu tamamlandı</p>
                    {stats.totalQuizzes > 0 && (
                      <p>{stats.totalQuizzes} quiz çözüldü</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Suggested Topic */}
            {nextTopic && (
              <Card className="border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-blue-900 dark:text-blue-200">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-current" />
                    Önerilen Sonraki Konu
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                    Önkoşulları tamamladınız, şimdi bunu öğrenebilirsiniz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopicCard topic={nextTopic} showProgress={false} />
                </CardContent>
              </Card>
            )}

            {/* Learning Path */}
            {learningPath.length > 0 && (
              <LearningPathCard
                topics={learningPath}
                title="Öğrenme Yolun"
              />
            )}
          </div>

          {/* Middle & Right Columns - Topic Cards */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Topics */}
            {recentTopics.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Son Çalıştıkların
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentTopics.map((progress) => {
                    const topic = allTopics.find(t => t.id === progress.topicId);
                    if (!topic) return null;
                    return <TopicCard key={topic.id} topic={topic} />;
                  })}
                </div>
              </div>
            )}

            {/* Popular Topics */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                {recentTopics.length > 0 ? 'Diğer Konular' : 'Başlangıç Konuları'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </div>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/10">
              <CardContent className="py-8">
                <div className="text-center flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-2">Tüm Konuları Keşfet</h3>
                  <p className="text-blue-100 text-sm mb-6 max-w-md">
                    {allTopics.length} konu, 5 seviye, interaktif simülasyonlar ve laboratuvar ortamı.
                  </p>
                  <Link href="/topics">
                    <Button variant="secondary" size="lg" className="gap-2 font-semibold">
                      <BookOpen className="w-4 h-4" />
                      Tüm Konuları Listele
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center pb-8">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold">AI Atlası</span> - Yapay Zeka Öğrenme ve Deney Laboratuvarı
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            Geliştiren & Düzenleyen: <span className="font-semibold text-blue-600 dark:text-blue-400">Kenan AY</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            v2.0.0 - Sprint 2 Complete
          </p>
        </footer>
      </section>
    </div>
  );
}

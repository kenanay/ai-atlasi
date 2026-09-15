'use client';

import { useState, useEffect } from 'react';
import { useProgress } from '@/lib/use-progress';
import { getAllTopics } from '@/lib/topics';
import { getProgressStats } from '@/lib/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Clock, 
  Target,
  BookOpen,
  Zap,
  BarChart3,
  Activity,
  Brain
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import Link from 'next/link';

export default function AnalyticsPage() {
  const allProgress = useProgress();
  const allTopics = getAllTopics();
  const stats = getProgressStats(allProgress);
  const [last7Days, setLast7Days] = useState<Array<{ date: string; topics: number; minutes: number }>>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Client-side only data generation (hidrasyon uyumsuzluğunu önler)
  useEffect(() => {
    // Son 7 gün aktivite (simulated - gerçek implementasyonda tarih bazlı olacak)
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
        topics: Math.floor(Math.random() * 3), // Simulated
        minutes: Math.floor(Math.random() * 120) // Simulated
      };
    });
    setLast7Days(days);

    // Streak hesaplama (simulated)
    setCurrentStreak(7);
    setLongestStreak(12);
  }, []);

  // Kategori analizi
  const categoryStats = allTopics.reduce((acc, topic) => {
    const progress = allProgress.find(p => p.topicId === topic.id);
    if (!acc[topic.category]) {
      acc[topic.category] = { total: 0, completed: 0, inProgress: 0, timeSpent: 0 };
    }
    acc[topic.category].total++;
    if (progress?.status === 'completed') {
      acc[topic.category].completed++;
    } else if (progress?.status === 'in_progress') {
      acc[topic.category].inProgress++;
    }
    acc[topic.category].timeSpent += progress?.timeSpent || 0;
    return acc;
  }, {} as Record<string, { total: number; completed: number; inProgress: number; timeSpent: number }>);

  // Seviye dağılımı
  const levelStats = [0, 1, 2, 3, 4].map(level => {
    const topicsAtLevel = allTopics.filter(t => t.level === level);
    const completed = topicsAtLevel.filter(t => 
      allProgress.find(p => p.topicId === t.id)?.status === 'completed'
    ).length;
    return {
      level,
      total: topicsAtLevel.length,
      completed,
      percentage: topicsAtLevel.length > 0 ? (completed / topicsAtLevel.length) * 100 : 0
    };
  });

  // En çok çalışılan kategoriler (top 3)
  const topCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1].timeSpent - a[1].timeSpent)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Öğrenme Analitikleri
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                İlerlemenizi takip edin ve içgörüler kazanın
              </p>
            </div>
          </div>
        </div>

        {/* Ana Metrikler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                  <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Badge variant="success" className="text-[10px]">+12%</Badge>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.completedCount}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                Tamamlanan Konu
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="primary" className="text-[10px]">{stats.completionRate.toFixed(0)}%</Badge>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.inProgressCount}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                Devam Eden
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {formatDuration(stats.totalTimeSpent)}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                Toplam Süre
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-lg">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {currentStreak} 🔥
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                Günlük Streak
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon */}
          <div className="lg:col-span-2 space-y-6">
            {/* Genel İlerleme */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Genel İlerleme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tamamlanma Oranı
                    </span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar value={stats.completionRate} size="lg" showLabel={false} />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {stats.completedCount} / {allTopics.length} konu tamamlandı
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.completedCount}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                      Tamamlandı
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.inProgressCount}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                      Devam Ediyor
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/40">
                    <p className="text-xl font-bold text-slate-600 dark:text-slate-400">
                      {allTopics.length - stats.completedCount - stats.inProgressCount}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                      Başlanmadı
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seviye Dağılımı */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Seviye Bazlı İlerleme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {levelStats.map(({ level, total, completed, percentage }) => (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={level >= 3 ? 'danger' : level >= 2 ? 'warning' : 'primary'}
                          className="text-[10px]"
                        >
                          Seviye {level}
                        </Badge>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {completed} / {total}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <ProgressBar value={percentage} size="sm" showLabel={false} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Son 7 Gün Aktivite */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Son 7 Gün
                </CardTitle>
              </CardHeader>
              <CardContent>
                {last7Days.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                    Yükleniyor...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {last7Days.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-12">
                          {day.date}
                        </span>
                        <div className="flex-1 mx-3">
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                              style={{ width: `${Math.min((day.minutes / 120) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {day.minutes}dk
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {day.topics} konu
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sağ Kolon */}
          <div className="space-y-6">
            {/* Streak Bilgisi */}
            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
              <CardContent className="py-6 text-center">
                <div className="text-5xl mb-2">🔥</div>
                <p className="text-3xl font-extrabold mb-1">{currentStreak} Gün</p>
                <p className="text-xs text-amber-100 font-medium mb-4">Mevcut Streak</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-xs text-amber-100 mb-1">En Uzun Streak</p>
                  <p className="text-xl font-bold">{longestStreak} gün</p>
                </div>
              </CardContent>
            </Card>

            {/* En Çok Çalışılan Kategoriler */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Top Kategoriler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCategories.map(([category, data], index) => (
                  <div key={category} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate capitalize">
                        {category}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {formatDuration(data.timeSpent)} · {data.completed}/{data.total} tamamlandı
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quiz Performansı */}
            {stats.totalQuizzes > 0 && (
              <Card className="border-l-4 border-l-teal-500">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Quiz İstatistikleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Çözülen Quiz</span>
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {stats.totalQuizzes}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hızlı Aksiyonlar */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/60 dark:border-blue-900/40">
              <CardContent className="py-4 space-y-2">
                <Link href="/topics">
                  <Button variant="primary" size="sm" className="w-full justify-start gap-2 text-xs">
                    <BookOpen className="w-4 h-4" />
                    Öğrenmeye Devam Et
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                    <Target className="w-4 h-4" />
                    Konu Ara
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

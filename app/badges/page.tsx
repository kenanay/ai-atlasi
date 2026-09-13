'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BadgeDisplay } from '@/components/ui/BadgeDisplay';
import { BADGES, getUnlockedBadges, getBadgeStats, Badge as BadgeType } from '@/lib/badges';
import { Award, Trophy, Target, Sparkles } from 'lucide-react';

type FilterType = 'all' | 'unlocked' | 'locked';
type CategoryFilter = 'all' | 'completion' | 'streak' | 'mastery' | 'special';

export default function BadgesPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState(getBadgeStats());

  useEffect(() => {
    const unlocked = getUnlockedBadges();
    setUnlockedBadges(new Set(unlocked.map(b => b.badgeId)));
    setStats(getBadgeStats());

    const handleBadgeChange = () => {
      const updated = getUnlockedBadges();
      setUnlockedBadges(new Set(updated.map(b => b.badgeId)));
      setStats(getBadgeStats());
    };

    window.addEventListener('ai-atlasi-badges-change', handleBadgeChange);
    return () => window.removeEventListener('ai-atlasi-badges-change', handleBadgeChange);
  }, []);

  const allBadges = Object.values(BADGES);
  const unlockedList = getUnlockedBadges();

  const filteredBadges = allBadges.filter(badge => {
    const isUnlocked = unlockedBadges.has(badge.id);
    
    // Filter by unlock status
    if (filter === 'unlocked' && !isUnlocked) return false;
    if (filter === 'locked' && isUnlocked) return false;

    // Filter by category
    if (categoryFilter !== 'all' && badge.category !== categoryFilter) return false;

    return true;
  });

  const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    const aUnlocked = unlockedBadges.has(a.id);
    const bUnlocked = unlockedBadges.has(b.id);
    
    if (aUnlocked !== bUnlocked) return bUnlocked ? 1 : -1;
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Rozetler & Başarılar
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                İlerlemenizi kutlayın ve yeni hedefler kazanın
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <Badge variant="warning" className="text-[10px]">
                  {stats.percentage}%
                </Badge>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.unlocked}/{stats.total}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                Toplam Rozet
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.byRarity.legendary + stats.byRarity.epic}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                Epic & Legendary
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.byCategory.completion}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                Tamamlama Rozetleri
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                  <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {stats.byCategory.mastery}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                Ustalık Rozetleri
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 block">
                  Durum
                </label>
                <div className="flex gap-2">
                  {(['all', 'unlocked', 'locked'] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`
                        flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                        ${filter === f
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      {f === 'all' ? 'Tümü' : f === 'unlocked' ? 'Kazanılan' : 'Kilitli'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 block">
                  Kategori
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'completion', 'streak', 'mastery', 'special'] as CategoryFilter[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategoryFilter(c)}
                      className={`
                        px-3 py-2 rounded-lg text-xs font-semibold transition-all
                        ${categoryFilter === c
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      {c === 'all' ? 'Tümü' : 
                       c === 'completion' ? 'Tamamlama' :
                       c === 'streak' ? 'Streak' :
                       c === 'mastery' ? 'Ustalık' : 'Özel'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {sortedBadges.map((badge) => {
            const userBadge = unlockedList.find(ub => ub.badgeId === badge.id);
            return (
              <BadgeDisplay
                key={badge.id}
                badge={badge}
                unlocked={unlockedBadges.has(badge.id)}
                unlockedAt={userBadge?.unlockedAt}
                size="md"
                showDetails
              />
            );
          })}
        </div>

        {/* Empty State */}
        {sortedBadges.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-5xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Rozet Bulunamadı
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Farklı filtreler deneyin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

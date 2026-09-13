'use client';

import { Badge as BadgeType, BADGES, UserBadge } from '@/lib/badges';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badge: BadgeType;
  unlocked?: boolean;
  unlockedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export function BadgeDisplay({
  badge,
  unlocked = false,
  unlockedAt,
  size = 'md',
  showDetails = true,
  className
}: BadgeDisplayProps) {
  const badgeInfo = BADGES[badge.id];

  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl'
  };

  const rarityColors = {
    common: 'from-slate-400 to-slate-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 via-orange-500 to-red-600'
  };

  const rarityBorder = {
    common: 'border-slate-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500'
  };

  const rarityGlow = {
    common: '',
    rare: 'shadow-lg shadow-blue-500/50',
    epic: 'shadow-xl shadow-purple-500/50',
    legendary: 'shadow-2xl shadow-yellow-500/60 animate-pulse'
  };

  return (
    <div className={cn('group relative', className)}>
      {/* Badge Icon */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-2xl border-4 transition-all duration-300',
          sizeClasses[size],
          unlocked
            ? `bg-gradient-to-br ${rarityColors[badgeInfo.rarity]} ${rarityBorder[badgeInfo.rarity]} ${rarityGlow[badgeInfo.rarity]} group-hover:scale-110`
            : 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-700 opacity-40 grayscale'
        )}
      >
        <span className={unlocked ? '' : 'opacity-30'}>
          {badgeInfo.icon}
        </span>

        {/* Legendary sparkle effect */}
        {unlocked && badgeInfo.rarity === 'legendary' && (
          <>
            <span className="absolute top-1 right-1 text-xs">✨</span>
            <span className="absolute bottom-1 left-1 text-xs">✨</span>
          </>
        )}

        {/* Locked overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
            <span className="text-2xl">🔒</span>
          </div>
        )}
      </div>

      {/* Badge Details */}
      {showDetails && (
        <div className="mt-2 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h3 className={cn(
              'text-sm font-bold',
              unlocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-600'
            )}>
              {badgeInfo.name}
            </h3>
            <Badge
              variant={
                badgeInfo.rarity === 'legendary' ? 'warning' :
                badgeInfo.rarity === 'epic' ? 'danger' :
                badgeInfo.rarity === 'rare' ? 'primary' : 'default'
              }
              className="text-[9px] uppercase px-1.5 py-0.5"
            >
              {badgeInfo.rarity}
            </Badge>
          </div>
          <p className={cn(
            'text-xs',
            unlocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-600'
          )}>
            {badgeInfo.description}
          </p>
          {!unlocked && (
            <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-1 italic">
              {badgeInfo.requirement}
            </p>
          )}
          {unlocked && unlockedAt && (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              ✓ {new Date(unlockedAt).toLocaleDateString('tr-TR')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Badge unlock notification
interface BadgeUnlockNotificationProps {
  badge: BadgeType;
  onClose: () => void;
}

export function BadgeUnlockNotification({ badge, onClose }: BadgeUnlockNotificationProps) {
  const badgeInfo = BADGES[badge.id];

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-500">
      <div className="bg-white dark:bg-slate-900 border-4 border-yellow-500 rounded-2xl shadow-2xl shadow-yellow-500/40 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl animate-bounce">
              {badgeInfo.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                🎉 Yeni Rozet!
              </h3>
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-0.5">
              {badgeInfo.name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {badgeInfo.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

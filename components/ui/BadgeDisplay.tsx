'use client';

import * as React from 'react';
import { Badge as BadgeType, BADGES, UserBadge, BadgeProgress } from '@/lib/badges';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badge: BadgeType;
  unlocked?: boolean;
  unlockedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
  progress?: BadgeProgress | null;
}

export function BadgeDisplay({
  badge,
  unlocked = false,
  unlockedAt,
  size = 'md',
  showDetails = true,
  className,
  progress
}: BadgeDisplayProps) {
  const badgeInfo = BADGES[badge.id];

  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl'
  };

  const rarityColors = {
    common: 'from-slate-400 via-slate-500 to-slate-600 dark:from-slate-500 dark:via-slate-600 dark:to-slate-700',
    rare: 'from-blue-400 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-blue-600 dark:to-blue-700',
    epic: 'from-purple-400 via-purple-500 to-purple-600 dark:from-purple-500 dark:via-purple-600 dark:to-purple-700',
    legendary: 'from-yellow-400 via-orange-500 to-red-600 dark:from-yellow-500 dark:via-orange-600 dark:to-red-700'
  };

  const rarityBorder = {
    common: 'border-slate-500 dark:border-slate-600',
    rare: 'border-blue-500 dark:border-blue-600',
    epic: 'border-purple-500 dark:border-purple-600',
    legendary: 'border-yellow-500 dark:border-yellow-600'
  };

  const rarityGlow = {
    common: '',
    rare: 'shadow-lg shadow-blue-500/50 dark:shadow-blue-400/40',
    epic: 'shadow-xl shadow-purple-500/50 dark:shadow-purple-400/40',
    legendary: 'shadow-2xl shadow-yellow-500/60 dark:shadow-yellow-400/50'
  };

  // Tooltip content
  const tooltipContent = (
    <div className="space-y-2 max-w-xs">
      <div className="flex items-center gap-2 justify-between">
        <p className="font-bold text-sm">{badgeInfo.name}</p>
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
      <p className="text-xs text-slate-300">{badgeInfo.description}</p>
      <div className="text-[10px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-700">
        <p>
          <span className="font-semibold">Kategori:</span>{' '}
          {badgeInfo.category === 'completion' ? 'Tamamlama' :
           badgeInfo.category === 'streak' ? 'Streak' :
           badgeInfo.category === 'mastery' ? 'Ustalık' : 'Özel'}
        </p>
        {!unlocked && (
          <p className="text-amber-400 font-medium">
            🔒 {badgeInfo.requirement}
          </p>
        )}
        {unlocked && unlockedAt && (
          <p className="text-emerald-400 font-medium">
            ✓ Kazanıldı: {new Date(unlockedAt).toLocaleDateString('tr-TR')}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Tooltip content={tooltipContent} side="top" delayDuration={300}>
      <div className={cn('group relative', className)}>
        {/* Badge Icon */}
        <div
          className={cn(
            'relative flex items-center justify-center rounded-2xl border-4 transition-all duration-300',
            sizeClasses[size],
            unlocked
              ? `bg-gradient-to-br ${rarityColors[badgeInfo.rarity]} ${rarityBorder[badgeInfo.rarity]} ${rarityGlow[badgeInfo.rarity]} group-hover:scale-110`
              : 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 border-2 border-dashed border-slate-400 dark:border-slate-600 opacity-60 grayscale group-hover:opacity-70'
          )}
          role="img"
          aria-label={`${badgeInfo.name} rozeti${unlocked ? ' - kazanıldı' : ' - kilitli'}`}
        >
          <span className={unlocked ? '' : 'opacity-40'}>
            {badgeInfo.icon}
          </span>

          {/* Legendary sparkle effect */}
          {unlocked && badgeInfo.rarity === 'legendary' && (
            <>
              <span className="absolute top-1 right-1 text-xs animate-pulse">✨</span>
              <span className="absolute bottom-1 left-1 text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>✨</span>
            </>
          )}

          {/* Legendary animated border */}
          {unlocked && badgeInfo.rarity === 'legendary' && (
            <div 
              className="absolute inset-0 rounded-2xl opacity-75 animate-spin-slow"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(251, 191, 36, 0.6) 50%, transparent 100%)',
                animationDuration: '3s'
              }}
            />
          )}

          {/* Locked overlay */}
          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 rounded-xl">
              <span className="text-2xl drop-shadow-lg">🔒</span>
            </div>
          )}
        </div>

        {/* Badge Details */}
        {showDetails && (
          <div className="mt-2 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h3 className={cn(
                'text-sm font-bold',
                unlocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500'
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
              unlocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'
            )}>
              {badgeInfo.description}
            </p>
            
            {/* Progress indicator for locked badges */}
            {!unlocked && progress && progress.total > 0 && (
              <div className="mt-2 space-y-1">
                <ProgressBar 
                  value={progress.current} 
                  max={progress.total} 
                  size="sm"
                  className="h-1.5"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">
                  {progress.current}/{progress.total} {progress.label}
                </p>
              </div>
            )}

            {!unlocked && !progress && (
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
    </Tooltip>
  );
}

// Badge unlock notification
interface BadgeUnlockNotificationProps {
  badge: BadgeType;
  onClose: () => void;
  index?: number;
}

export function BadgeUnlockNotification({ badge, onClose, index = 0 }: BadgeUnlockNotificationProps) {
  const badgeInfo = BADGES[badge.id];

  // Auto-dismiss after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const rarityColors = {
    common: 'border-slate-500 shadow-slate-500/40',
    rare: 'border-blue-500 shadow-blue-500/40',
    epic: 'border-purple-500 shadow-purple-500/40',
    legendary: 'border-yellow-500 shadow-yellow-500/40'
  };

  const rarityBg = {
    common: 'from-slate-400 to-slate-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  return (
    <div 
      className="animate-in slide-in-from-right duration-500 fade-in"
      style={{ 
        marginBottom: index > 0 ? '0.5rem' : 0,
        animationDelay: `${index * 100}ms`
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className={cn(
        "bg-white dark:bg-slate-900 border-4 rounded-2xl shadow-2xl p-4 max-w-sm",
        rarityColors[badgeInfo.rarity]
      )}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className={cn(
              "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-3xl",
              rarityBg[badgeInfo.rarity],
              badgeInfo.rarity === 'legendary' ? 'animate-bounce' : 'animate-pulse'
            )}>
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
            <div className="mt-1">
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
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Bildirimi kapat"
          >
            ✕
          </button>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        <div className="mt-3 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-shrink-width"
            style={{ animationDuration: '5s' }}
          />
        </div>
      </div>
    </div>
  );
}

// Badge notification queue container
interface BadgeNotificationQueueProps {
  badges: BadgeType[];
  onDismiss: (badgeId: BadgeType) => void;
}

export function BadgeNotificationQueue({ badges, onDismiss }: BadgeNotificationQueueProps) {
  if (badges.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {badges.map((badgeId, index) => (
        <BadgeUnlockNotification
          key={String(badgeId)}
          badge={badgeId}
          onClose={() => onDismiss(badgeId)}
          index={index}
        />
      ))}
    </div>
  );
}

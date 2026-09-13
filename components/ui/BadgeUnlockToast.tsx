'use client';

import { useEffect, useState } from 'react';
import { BadgeType, BADGES } from '@/lib/badges';
import { X } from 'lucide-react';

interface BadgeUnlockToastProps {
  badges: BadgeType[];
  onDismiss: (badgeId: BadgeType) => void;
}

export function BadgeUnlockToast({ badges, onDismiss }: BadgeUnlockToastProps) {
  const [visibleBadges, setVisibleBadges] = useState<BadgeType[]>([]);

  useEffect(() => {
    if (badges.length > 0) {
      // Her badge'i sırayla göster
      badges.forEach((badgeId, index) => {
        setTimeout(() => {
          setVisibleBadges(prev => [...prev, badgeId]);
          
          // 5 saniye sonra otomatik kapat
          setTimeout(() => {
            handleDismiss(badgeId);
          }, 5000);
        }, index * 500); // Her badge 500ms arayla
      });
    }
  }, [badges]);

  const handleDismiss = (badgeId: BadgeType) => {
    setVisibleBadges(prev => prev.filter(b => b !== badgeId));
    onDismiss(badgeId);
  };

  if (visibleBadges.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-3 max-w-sm">
      {visibleBadges.map((badgeIdKey, index) => {
        const badgeInfo = BADGES[badgeIdKey];
        
        return (
          <div
            key={String(badgeIdKey)}
            className="animate-in slide-in-from-right duration-500 fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-[3px] rounded-2xl shadow-2xl">
              <div className="bg-white dark:bg-slate-900 rounded-[14px] p-4">
                <div className="flex items-start gap-3">
                  {/* Badge Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl animate-bounce shadow-lg">
                      {badgeInfo.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎉</span>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                          Yeni Rozet!
                        </h3>
                      </div>
                      <button
                        onClick={() => handleDismiss(badgeIdKey)}
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                      {badgeInfo.name}
                    </p>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {badgeInfo.description}
                    </p>

                    {/* Rarity Badge */}
                    <div className="mt-2">
                      <span className={`
                        inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${badgeInfo.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                          badgeInfo.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                          badgeInfo.rarity === 'rare' ? 'bg-blue-500 text-white' :
                          'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}
                      `}>
                        {badgeInfo.rarity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-progress" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </div>
  );
}

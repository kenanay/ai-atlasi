'use client';

import { useEffect, useState } from 'react';
import { useProgress } from '@/lib/use-progress';
import { useGlobalShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ShortcutsModal } from '@/components/ui/ShortcutsModal';
import { BadgeUnlockToast } from '@/components/ui/BadgeUnlockToast';
import { checkAndUnlockBadges, UserBadge, BadgeType } from '@/lib/badges';

export function GlobalProviders() {
  const shortcuts = useGlobalShortcuts();
  const progress = useProgress();
  const [newBadges, setNewBadges] = useState<BadgeType[]>([]);

  useEffect(() => {
    if (progress.length > 0) {
      const unlocked = checkAndUnlockBadges(progress);
      if (unlocked.length > 0) {
        // Sadece yeni badge'leri göster
        const trulyNew = unlocked.filter(b => b.isNew);
        if (trulyNew.length > 0) {
          setNewBadges(trulyNew.map(b => b.badgeId));
        }
      }
    }
  }, [progress]);

  const handleDismiss = (badgeId: BadgeType) => {
    setNewBadges(prev => prev.filter(b => b !== badgeId));
  };

  return (
    <>
      <ShortcutsModal shortcuts={shortcuts} />
      <BadgeUnlockToast
        badges={newBadges}
        onDismiss={handleDismiss}
      />
    </>
  );
}

"use client";
import { useMemo, useSyncExternalStore, useEffect } from 'react';
import { STORAGE_KEY, validateProgress } from './progress';
import { checkAndUnlockBadges } from './badges';
import type { UserProgress } from '@/types';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('ai-atlasi-progress-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('ai-atlasi-progress-change', callback);
  };
}

function snapshot() {
  try { return localStorage.getItem(STORAGE_KEY) ?? '[]'; } catch { return '[]'; }
}

export function useProgress(): UserProgress[] {
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]');
  const progress = useMemo(() => {
    try { const data: unknown = JSON.parse(raw); return validateProgress(data) ? data : []; }
    catch { return []; }
  }, [raw]);

  // Badge kontrolü yap
  useEffect(() => {
    if (progress.length > 0) {
      checkAndUnlockBadges(progress);
    }
  }, [progress]);

  return progress;
}

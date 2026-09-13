'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  category: 'navigation' | 'action' | 'ui';
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Input elementlerinde kısayolları devre dışı bırak
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

// Global shortcuts hook
export function useGlobalShortcuts() {
  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: 'h',
      description: 'Ana Sayfa',
      action: () => router.push('/'),
      category: 'navigation'
    },
    {
      key: 't',
      description: 'Konular',
      action: () => router.push('/topics'),
      category: 'navigation'
    },
    {
      key: 'a',
      description: 'Analitik',
      action: () => router.push('/analytics'),
      category: 'navigation'
    },
    {
      key: 'b',
      description: 'Rozetler',
      action: () => router.push('/badges'),
      category: 'navigation'
    },
    {
      key: 'c',
      description: 'Kod Lab',
      action: () => router.push('/code-lab'),
      category: 'navigation'
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Arama',
      action: () => router.push('/search'),
      category: 'navigation'
    },
    {
      key: ',',
      ctrl: true,
      description: 'Ayarlar',
      action: () => router.push('/settings'),
      category: 'navigation'
    },
    // UI shortcuts
    {
      key: 'd',
      ctrl: true,
      description: 'Dark Mode',
      action: () => {
        const event = new CustomEvent('toggle-theme');
        window.dispatchEvent(event);
      },
      category: 'ui'
    },
    {
      key: '?',
      shift: true,
      description: 'Kısayolları Göster',
      action: () => {
        const event = new CustomEvent('show-shortcuts-modal');
        window.dispatchEvent(event);
      },
      category: 'ui'
    },
    // Action shortcuts
    {
      key: 'Escape',
      description: 'Modal Kapat',
      action: () => {
        const event = new CustomEvent('close-modal');
        window.dispatchEvent(event);
      },
      category: 'action'
    }
  ];

  useKeyboardShortcuts(shortcuts, true);

  return shortcuts;
}

// Format shortcut key for display
export function formatShortcutKey(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.meta) parts.push('⌘');
  
  const key = shortcut.key === ' ' ? 'Space' : 
              shortcut.key === 'Escape' ? 'Esc' :
              shortcut.key.toUpperCase();
  
  parts.push(key);
  
  return parts.join(' + ');
}

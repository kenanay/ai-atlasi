'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSyncExternalStore, useEffect } from 'react';

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { theme, setTheme } = useTheme();

  // Klavye kısayolu ile tema değiştirme
  useEffect(() => {
    const handleToggle = () => {
      const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(theme);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      setTheme(nextTheme);
    };

    window.addEventListener('toggle-theme', handleToggle);
    return () => window.removeEventListener('toggle-theme', handleToggle);
  }, [theme, setTheme]);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50"
      >
        <Sun className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-medium">Tema</span>
      </Button>
    );
  }

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4 text-amber-500 animate-scale-in" />;
      case 'dark':
        return <Moon className="w-4 h-4 text-blue-400 animate-scale-in" />;
      case 'system':
        return <Monitor className="w-4 h-4 text-slate-400 animate-scale-in" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Açık';
      case 'dark':
        return 'Koyu';
      case 'system':
        return 'Sistem';
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      className="gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-xs transition-all duration-300 hover:scale-105"
      title={`Tema: ${getLabel()} (Değiştirmek için tıklayın veya Ctrl+D)`}
    >
      {getIcon()}
      <span className="text-xs font-medium">{getLabel()}</span>
    </Button>
  );
}

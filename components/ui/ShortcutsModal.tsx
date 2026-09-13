'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, Keyboard, Navigation, Zap, Sparkles } from 'lucide-react';
import { KeyboardShortcut, formatShortcutKey } from '@/hooks/useKeyboardShortcuts';

interface ShortcutsModalProps {
  shortcuts: KeyboardShortcut[];
}

export function ShortcutsModal({ shortcuts }: ShortcutsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('show-shortcuts-modal', handleOpen);
    window.addEventListener('close-modal', handleClose);

    return () => {
      window.removeEventListener('show-shortcuts-modal', handleOpen);
      window.removeEventListener('close-modal', handleClose);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const categoryIcons = {
    navigation: Navigation,
    action: Zap,
    ui: Sparkles
  };

  const categoryNames = {
    navigation: 'Navigasyon',
    action: 'Aksiyonlar',
    ui: 'Kullanıcı Arayüzü'
  };

  const categoryColors = {
    navigation: 'text-blue-600 dark:text-blue-400',
    action: 'text-purple-600 dark:text-purple-400',
    ui: 'text-emerald-600 dark:text-emerald-400'
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-3xl max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-2 shadow-2xl">
            <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Keyboard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      Klavye Kısayolları
                    </CardTitle>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Hızlı navigasyon ve aksiyonlar için
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Kapat
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                const categoryName = categoryNames[category as keyof typeof categoryNames];
                const colorClass = categoryColors[category as keyof typeof categoryColors];

                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-4 h-4 ${colorClass}`} />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                        {categoryName}
                      </h3>
                      <Badge variant="default" className="text-[9px]">
                        {categoryShortcuts.length}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                            {shortcut.description}
                          </span>
                          <div className="flex items-center gap-1">
                            {formatShortcutKey(shortcut).split(' + ').map((key, i, arr) => (
                              <div key={i} className="flex items-center gap-1">
                                <kbd className="px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-md shadow-sm group-hover:border-slate-400 dark:group-hover:border-slate-600 transition-colors font-mono">
                                  {key}
                                </kbd>
                                {i < arr.length - 1 && (
                                  <span className="text-slate-400 dark:text-slate-600 text-xs font-bold">
                                    +
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <p className="text-slate-600 dark:text-slate-400">
                    💡 <span className="font-semibold">İpucu:</span> Bu pencereyi açmak için{' '}
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono">
                      ?
                    </kbd>{' '}
                    tuşuna basın
                  </p>
                  <p className="text-slate-500 dark:text-slate-500">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono">
                      Esc
                    </kbd>{' '}
                    ile kapat
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

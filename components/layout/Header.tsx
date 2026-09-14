'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Search, BookOpen, Settings, Home, TrendingUp, Code, Award, Map, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Ana Sayfa', icon: Home },
    { href: '/topics', label: 'Konular', icon: BookOpen },
    { href: '/learning-map', label: 'Öğrenme Haritası', icon: Map },
    { href: '/simulators', label: 'Simülasyonlar', icon: Sparkles },
    { href: '/analytics', label: 'Analitik', icon: TrendingUp },
    { href: '/badges', label: 'Rozetler', icon: Award },
    { href: '/code-lab', label: 'Kod Lab', icon: Code },
    { href: '/search', label: 'Ara', icon: Search },
    { href: '/settings', label: 'Ayarlar', icon: Settings },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-all duration-300 animate-slide-in-left">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 mr-8 group">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-sm group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-none text-slate-900 dark:text-slate-100 tracking-tight">AI Atlası</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Yapay Zeka Laboratuvarı</span>
          </div>
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center space-x-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border dark:border-blue-800/50 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-105'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* User Section */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <button
            onClick={() => {
              const event = new CustomEvent('show-shortcuts-modal');
              window.dispatchEvent(event);
            }}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 hover:scale-105"
            title="Klavye Kısayolları (?)"
          >
            <kbd className="text-xs font-bold">?</kbd>
          </button>
          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            <span>Kişisel Mod</span>
          </div>
        </div>
      </div>
    </header>
  );
}
